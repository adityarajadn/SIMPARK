
import { ZONES } from './data.js';

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function initDynamicQRCode() {
  const qrContainer = document.getElementById('simpark-qrcode');
  if (!qrContainer || typeof QRCode === 'undefined') return;

  const zoneKey = getQueryParam('zone') || 'A';
  const ticketId = 'TKT-' + Math.floor(100 + Math.random() * 900);

  qrContainer.innerHTML = '';
  new QRCode(qrContainer, {
    text: `SIMPARK-UB:${ticketId}:ZONE-${zoneKey}:TIMESTAMP-${Date.now()}`,
    width: 170,
    height: 170,
    colorDark: "#1763B1",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

export function initTicketCountdown() {
  const countdownEl = document.getElementById('ticket-countdown-timer');
  const progressEl = document.getElementById('ticket-progress-bar');
  if (!countdownEl) return;

  let remaining = 582;
  const interval = setInterval(function () {
    if (remaining > 0) {
      remaining--;
      const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
      const secs = (remaining % 60).toString().padStart(2, '0');
      countdownEl.textContent = `${mins}:${secs}`;
      if (progressEl) {
        progressEl.style.width = `${(remaining / 600) * 100}%`;
      }
    } else {
      clearInterval(interval);
      countdownEl.textContent = "00:00";
    }
  }, 1000);
}

export function initExploreFilters() {
  const filterChips = document.querySelectorAll('#explore-filter-chips .chip-simpark');
  const simparkMapEl = document.querySelector('simpark-map');
  const searchInputEl = document.querySelector('#explore-search-input input');
  const sortComponent = document.querySelector('#explore-sort-input');
  const zoneCards = document.querySelectorAll('simpark-zone-card');
  const countEl = document.getElementById('explore-zone-count');

  let currentFilter = 'all';
  let currentKeyword = '';
  let currentSort = 'Waktu tercepat';

  function applyFilterAndSearch() {
    let visibleCount = 0;
    const cardsArray = Array.from(zoneCards);

    // Sorting kartu berdasarkan pilihan dropdown
    cardsArray.sort(function (a, b) {
      if (currentSort === 'Waktu tercepat') {
        const timeA = parseInt(a.getAttribute('estimate') || '0', 10);
        const timeB = parseInt(b.getAttribute('estimate') || '0', 10);
        return timeA - timeB;
      } else if (currentSort === 'Slot terbanyak') {
        const slotsA = parseInt((a.getAttribute('slots') || '0').split('/')[0], 10);
        const slotsB = parseInt((b.getAttribute('slots') || '0').split('/')[0], 10);
        return slotsB - slotsA; // descending
      } else if (currentSort === 'Jarak terdekat') {
        // Zona A terdekat ke FILKOM (urutan A, B, C)
        const keyA = a.getAttribute('zone-key') || '';
        const keyB = b.getAttribute('zone-key') || '';
        return keyA.localeCompare(keyB);
      }
      return 0;
    });

    const parentList = document.getElementById('explore-zone-list');
    cardsArray.forEach(function (card) {
      const tone = card.getAttribute('status-tone') || '';
      const name = (card.getAttribute('name') || '').toLowerCase();
      const zoneKey = (card.getAttribute('zone-key') || '').toLowerCase();

      const matchesTone = currentFilter === 'all' || tone === currentFilter;
      const matchesSearch = !currentKeyword || name.includes(currentKeyword) || zoneKey.includes(currentKeyword);

      if (matchesTone && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }

      if (parentList) {
        parentList.appendChild(card);
      }
    });

    if (countEl) {
      countEl.textContent = `${visibleCount} zona ditemukan · urut ${currentSort.toLowerCase()}`;
    }
  }

  if (filterChips.length) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) {
          c.classList.remove('active');
        });
        chip.classList.add('active');
        currentFilter = chip.getAttribute('data-filter') || 'all';
        applyFilterAndSearch();
      });
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener('input', function (e) {
      currentKeyword = e.target.value.trim().toLowerCase();
      applyFilterAndSearch();
    });
  }

  if (sortComponent) {
    sortComponent.addEventListener('change', function (e) {
      if (e.detail && e.detail.value) {
        currentSort = e.detail.value;
        applyFilterAndSearch();
      }
    });
  }

  // Interaktivitas kartu zona di explore.html untuk preview posisi peta
  if (zoneCards.length && simparkMapEl) {
    zoneCards.forEach(function (cardWrapper) {
      const anchor = cardWrapper.querySelector('a.explore-zone-card');
      const zoneKey = cardWrapper.getAttribute('zone-key');

      if (anchor) {
        anchor.addEventListener('mouseenter', function () {
          // Hover untuk preview posisi di peta
          if (simparkMapEl.showZone) {
            simparkMapEl.showZone(zoneKey);
          }
        });
      }
    });
  }
}

export function initZoneDetail() {
  const zoneKey = getQueryParam('zone') || 'A';
  const zone = ZONES[zoneKey] || ZONES['A'];

  document.querySelectorAll('.zone-detail-name').forEach(function (el) {
    el.textContent = zone.fullName;
  });
  document.querySelectorAll('.zone-detail-badge').forEach(function (el) {
    el.className = `badge-simpark ${zone.badgeClass}`;
    el.textContent = zone.statusText;
  });

  const recBadge = document.getElementById('zone-detail-recommendation-badge');
  if (recBadge) {
    if (zoneKey === 'A') {
      recBadge.classList.remove('d-none');
    } else {
      recBadge.classList.add('d-none');
    }
  }

  const slotEl = document.getElementById('zone-detail-slot');
  if (slotEl) slotEl.setAttribute('value', `${zone.slotAvailable} / ${zone.slotTotal}`);

  const antreanEl = document.getElementById('zone-detail-queue');
  if (antreanEl) antreanEl.setAttribute('value', zone.queue);

  const totalTimeEl = document.getElementById('zone-detail-total-time');
  if (totalTimeEl) totalTimeEl.textContent = `${zone.timeMinutes} menit`;

  if (document.getElementById('breakdown-travel')) document.getElementById('breakdown-travel').textContent = zone.breakdown.travel;
  if (document.getElementById('breakdown-queue')) document.getElementById('breakdown-queue').textContent = zone.breakdown.queue;
  if (document.getElementById('breakdown-search')) document.getElementById('breakdown-search').textContent = zone.breakdown.searchSlot;
  if (document.getElementById('breakdown-walk')) document.getElementById('breakdown-walk').textContent = zone.breakdown.walk;

  const confirmBtn = document.getElementById('btn-create-ticket-confirm');
  if (confirmBtn) {
    confirmBtn.href = `ticket.html?zone=${zoneKey}`;
  }
}

export function initLiveDate() {
  const dateEl = document.getElementById('current-date-display');
  if (!dateEl) return;

  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  dateEl.textContent = new Intl.DateTimeFormat('id-ID', options).format(now);
}

export function initActiveParkingTimer() {
  const durationTile = document.getElementById('active-parking-duration');
  if (!durationTile) return;

  // Mulai durasi dari 1 jam 12 menit 00 detik (4320 detik)
  let totalSeconds = (1 * 3600) + (12 * 60);

  setInterval(function () {
    totalSeconds++;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    durationTile.setAttribute('value', `${hours} j ${minutes} m ${seconds} d`);
  }, 1000);
}

export function initSweetAlertActions() {
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
}

export function initHistoryDataTable() {
  const table = document.getElementById('simpark-history-datatable');
  if (!table || typeof $ === 'undefined' || !$.fn.DataTable) return;

  $('#simpark-history-datatable').DataTable({
    pageLength: 5,
    lengthMenu: [5, 10, 25],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Cari riwayat atau zona...",
      lengthMenu: "Tampilkan _MENU_ baris",
      info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ riwayat",
      paginate: {
        previous: '<i class="bi bi-chevron-left"></i>',
        next: '<i class="bi bi-chevron-right"></i>'
      },
      zeroRecords: "Tidak ada data riwayat yang cocok"
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initLiveDate();
  initActiveParkingTimer();
  initTicketCountdown();
  initExploreFilters();
  initZoneDetail();
  initDynamicQRCode();
  initSweetAlertActions();
  initHistoryDataTable();
});
