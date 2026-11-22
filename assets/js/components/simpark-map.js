import { directionsUrl, zoneTitle } from '../data.js';

const campus = [-7.9535, 112.6144];
const colors = { success: '#237a49', warning: '#9a6700', error: '#b42318', destination: '#1763b1' };

export class SimparkMap extends HTMLElement {
  connectedCallback() {
    if (this.notice) return;
    this.notice = document.createElement('p');
    this.notice.className = 'map-notice text-caption mb-2';
    this.notice.setAttribute('role', 'status');
    this.container = document.createElement('div');
    this.container.className = 'simpark-map-surface';
    this.container.style.height = this.getAttribute('height') || '320px';
    this.container.setAttribute('aria-label', 'Peta interaktif SIMPARK UB');
    this.append(this.notice, this.container);
  }

  initializeMap(center, zoom) {
    if (!window.L) {
      this.notice.textContent = 'Peta tidak dapat dimuat. Informasi zona tetap tersedia di halaman ini.';
      this.container.hidden = true;
      return;
    }

    this.map = L.map(this.container, { scrollWheelZoom: false }).setView(center, zoom);
    this.markers = L.layerGroup().addTo(this.map);
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    tiles.on('loading', () => {
      this.tileFailed = false;
      this.notice.textContent = this.loaded ? '' : 'Memuat peta…';
    });
    tiles.on('tileerror', () => {
      this.tileFailed = true;
      this.notice.textContent = 'Sebagian peta gagal dimuat. Periksa koneksi internet.';
    });
    tiles.on('load', () => {
      this.loaded = !!this.container.querySelector('.leaflet-tile-loaded');
      this.notice.textContent = this.loaded
        ? (this.tileFailed ? 'Sebagian peta gagal dimuat. Periksa koneksi internet.' : '')
        : 'Peta tidak dapat dimuat. Periksa koneksi internet.';
    });
    tiles.addTo(this.map);
    this.observer = new ResizeObserver(() => {
      if (this.container.clientWidth) this.map.invalidateSize({ animate: false });
    });
    this.observer.observe(this.container);
  }

  update(destination, options, focusedZoneId) {
    const focus = options.find(option => option.zone.id === focusedZoneId)?.zone.titikMasuk;
    const point = focus || destination?.koordinat;
    const center = point ? [point.latitude, point.longitude] : campus;
    const zoom = focus ? 17 : 16;
    const cameraKey = focusedZoneId || destination?.id;

    if (!this.map) this.initializeMap(center, zoom);
    else if (this.cameraKey !== cameraKey) this.map.setView(center, zoom);
    this.cameraKey = cameraKey;
    if (!this.map) return;

    this.markers.clearLayers();
    if (destination?.koordinat) {
      const title = document.createElement('strong');
      title.textContent = destination.nama;
      this.addMarker(destination.koordinat, '★', 'destination', destination.nama, title);
    }

    for (const option of options) {
      const { zone, available, capacity, totalTime } = option;
      if (!zone.titikMasuk) continue;

      const popup = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = zoneTitle(zone);
      const stats = document.createElement('p');
      stats.className = 'mt-1 mb-1';
      const time = totalTime === null ? 'Estimasi belum tersedia' : `Estimasi ${totalTime} menit`;
      stats.textContent = `${capacity.label} · ${available} / ${zone.kapasitasTotal} slot · ${time}`;
      const directions = document.createElement('a');
      directions.href = directionsUrl(zone);
      directions.target = '_blank';
      directions.rel = 'noopener';
      directions.textContent = 'Arah ke Zona';
      popup.append(heading, stats, directions);
      this.addMarker(zone.titikMasuk, zone.id, capacity.tone, zoneTitle(zone), popup);
    }

  }

  addMarker(point, label, tone, title, popup) {
    const pin = document.createElement('span');
    pin.className = 'simpark-map-pin';
    pin.style.backgroundColor = colors[tone];
    pin.textContent = label;
    const icon = L.divIcon({
      className: 'simpark-custom-pin',
      html: pin,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });
    L.marker([point.latitude, point.longitude], { icon, title, alt: title })
      .addTo(this.markers).bindPopup(popup);
  }
}

customElements.define('simpark-map', SimparkMap);
