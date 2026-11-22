
export class SimparkMap extends HTMLElement {
  connectedCallback() {
    const height = this.getAttribute('height') || '100%';
    const zoneAttr = this.getAttribute('zone');
    const mapId = 'map-' + Math.random().toString(36).substring(2, 9);

    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = height === '100%' ? '100%' : height;

    this.innerHTML = `
      <div id="${mapId}" class="w-100 h-100 rounded-3 overflow-hidden position-relative" style="min-height: 280px; z-index: 1;"></div>
    `;

    this.initLeaflet(mapId, zoneAttr);
  }

  initLeaflet(containerId, initialZone) {
    const init = () => {
      if (typeof L === 'undefined') {
        setTimeout(init, 100);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const activeZone = initialZone || urlParams.get('zone');

      const allLocations = {
        dest: {
          name: "Gedung F — FILKOM",
          coords: [-7.9542, 112.6146],
          color: "#1763B1",
          label: "★",
          popup: "<b>Gedung F — FILKOM</b><br><span class='text-muted'>Gedung Tujuan Anda</span>"
        },
        A: {
          name: "Zona A — Parkir Teknik Utara",
          coords: [-7.9525, 112.6138],
          color: "#237A49",
          label: "A",
          popup: "<b>Zona A — Rekomendasi Utama</b><br>45 / 100 Slot Tersedia · Estimasi 8 mnt"
        },
        B: {
          name: "Zona B — Parkir FILKOM Selatan",
          coords: [-7.9552, 112.6130],
          color: "#B54708",
          label: "B",
          popup: "<b>Zona B — Alternatif</b><br>12 / 80 Slot Tersedia · Estimasi 9 mnt"
        },
        C: {
          name: "Zona C — Parkir Samantha Krida",
          coords: [-7.9530, 112.6162],
          color: "#B42318",
          label: "C",
          popup: "<b>Zona C — Samantha Krida</b><br><span style='color: #B42318;'>Penuh (0 Slot)</span> · Estimasi 11 mnt"
        }
      };

      let targetCenter = [-7.9535, 112.6144];
      let targetZoom = 16;
      let displayLocations = [];

      if (activeZone && allLocations[activeZone]) {
        targetCenter = allLocations[activeZone].coords;
        targetZoom = 17;
        displayLocations = [allLocations.dest, allLocations[activeZone]];
      } else {
        displayLocations = [allLocations.dest, allLocations.A, allLocations.B, allLocations.C];
      }

      const map = L.map(containerId, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView(targetCenter, targetZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const createMarkerIcon = (color, label) => L.divIcon({
        className: 'simpark-custom-pin',
        html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 13px;">${label}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      displayLocations.forEach(loc => {
        const marker = L.marker(loc.coords, {
          icon: createMarkerIcon(loc.color, loc.label)
        }).addTo(map);
        marker.bindPopup(loc.popup);
        if (loc.label === activeZone || (!activeZone && loc.label === 'A')) {
          marker.openPopup();
        }
      });

      this.leafletMap = map;
      this.markerData = allLocations;
      this.createMarkerIcon = createMarkerIcon;

      setTimeout(() => map.invalidateSize(), 300);
    };

    init();
  }

  showZone(zoneKey) {
    if (!this.leafletMap || !this.markerData) return;

    this.leafletMap.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.leafletMap.removeLayer(layer);
      }
    });

    const displayLocations = [this.markerData.dest];
    if (zoneKey && this.markerData[zoneKey]) {
      displayLocations.push(this.markerData[zoneKey]);
      this.leafletMap.setView(this.markerData[zoneKey].coords, 17);
    } else {
      displayLocations.push(this.markerData.A, this.markerData.B, this.markerData.C);
      this.leafletMap.setView([-7.9535, 112.6144], 16);
    }

    displayLocations.forEach(loc => {
      const marker = L.marker(loc.coords, {
        icon: this.createMarkerIcon(loc.color, loc.label)
      }).addTo(this.leafletMap);
      marker.bindPopup(loc.popup);
      if (loc.label === zoneKey) {
        marker.openPopup();
      }
    });
  }
}
customElements.define('simpark-map', SimparkMap);
