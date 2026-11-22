import { ZONES } from '../data.js';
import { getQueryParam } from './utils.js';

export function initActiveParkingState() {
  const emptyEl = document.getElementById('active-parking-empty');
  const contentEl = document.getElementById('active-parking-content');
  if (!emptyEl || !contentEl) return;

  // Cek dari query param atau localStorage
  const urlZone = getQueryParam('zone');
  const urlTicketId = getQueryParam('ticketId');
  const savedDataStr = localStorage.getItem('simpark_active_parking');
  let activeData = null;

  if (urlZone && urlTicketId) {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    activeData = {
      hasActive: true,
      ticketId: urlTicketId,
      zoneKey: urlZone,
      entryTime: timeStr,
      startTime: Date.now()
    };
    localStorage.setItem('simpark_active_parking', JSON.stringify(activeData));
  } else if (savedDataStr) {
    try {
      activeData = JSON.parse(savedDataStr);
    } catch (e) {
      activeData = null;
    }
  }

  // Jika tidak ada parkir aktif
  if (!activeData || !activeData.hasActive) {
    emptyEl.classList.remove('d-none');
    contentEl.classList.add('d-none');
    return;
  }

  // Jika ada parkir aktif, tampilkan konten dan isi datanya
  emptyEl.classList.add('d-none');
  contentEl.classList.remove('d-none');

  const zone = ZONES[activeData.zoneKey] || ZONES['A'];

  const zoneTitleEl = document.getElementById('active-zone-title');
  if (zoneTitleEl) zoneTitleEl.textContent = `Kendaraan tercatat di ${zone.id}`;

  const zoneCaptionEl = document.getElementById('active-zone-caption');
  if (zoneCaptionEl) {
    zoneCaptionEl.textContent = `Masuk ${activeData.entryTime} · diverifikasi petugas · tiket ${activeData.ticketId} sudah terpakai`;
  }

  const ticketIdEl = document.getElementById('active-ticket-id');
  if (ticketIdEl) ticketIdEl.textContent = activeData.ticketId;

  const zoneNameEl = document.getElementById('active-zone-name');
  if (zoneNameEl) zoneNameEl.textContent = zone.fullName;

  const entryTimeEl = document.getElementById('active-entry-time');
  if (entryTimeEl) entryTimeEl.textContent = activeData.entryTime;

  const modalTicketId = document.getElementById('modal-exit-ticket-id');
  if (modalTicketId) modalTicketId.textContent = activeData.ticketId;

  // Set peta aktif
  const mapEl = document.getElementById('active-parking-map');
  if (mapEl && mapEl.showZone) {
    mapEl.showZone(activeData.zoneKey);
  }
}

export function initActiveParkingTimer() {
  const durationTile = document.getElementById('active-parking-duration');
  if (!durationTile) return;

  const savedDataStr = localStorage.getItem('simpark_active_parking');
  let startSeconds = (1 * 3600) + (12 * 60); // Default: 1 jam 12 menit

  if (savedDataStr) {
    try {
      const data = JSON.parse(savedDataStr);
      if (data.startTime) {
        startSeconds = Math.max(0, Math.floor((Date.now() - data.startTime) / 1000));
      }
    } catch (e) {}
  }

  // Menggunakan EasyTimer.js
  if (typeof easytimer !== 'undefined') {
    const timer = new easytimer.Timer();
    timer.start({
      startValues: { seconds: startSeconds }
    });

    function renderTime() {
      const timeValues = timer.getTimeValues();
      const text = `${timeValues.hours} j ${timeValues.minutes} m ${timeValues.seconds} d`;
      durationTile.setAttribute('value', text);
      const innerVal = durationTile.querySelector('.stat-value');
      if (innerVal) {
        innerVal.textContent = text;
      }
    }

    renderTime();
    timer.addEventListener('secondsUpdated', renderTime);
  } else {
    // Fallback jika offline
    let currentSeconds = startSeconds;
    setInterval(function () {
      currentSeconds++;
      const hours = Math.floor(currentSeconds / 3600);
      const minutes = Math.floor((currentSeconds % 3600) / 60);
      const seconds = currentSeconds % 60;
      durationTile.setAttribute('value', `${hours} j ${minutes} m ${seconds} d`);
    }, 1000);
  }
}

export function initActiveParkingActions() {
  const saveBtn = document.getElementById('btn-save-location');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Catatan lokasi berhasil disimpan',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#1A1C1E',
          iconColor: '#237A49'
        });
      }
    });
  }

  // Handler saat selesai/keluar parkir: hapus sesi aktif dari localStorage
  const exitConfirmBtn = document.getElementById('btn-exit-parking-confirm');
  if (exitConfirmBtn) {
    exitConfirmBtn.addEventListener('click', function () {
      localStorage.removeItem('simpark_active_parking');
    });
  }
}
