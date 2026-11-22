
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
  const interval = setInterval(() => {
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

  if (filterChips.length) {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');

        document.querySelectorAll('.explore-zone-card').forEach(card => {
          const tone = card.getAttribute('data-tone');
          if (filter === 'all' || filter === tone) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Interaktivitas klik kartu zona di explore.html untuk update pin map
  const zoneCards = document.querySelectorAll('simpark-zone-card');
  if (zoneCards.length && simparkMapEl) {
    zoneCards.forEach(cardWrapper => {
      const anchor = cardWrapper.querySelector('a.explore-zone-card');
      const innerCard = cardWrapper.querySelector('.card-simpark');
      const zoneKey = cardWrapper.getAttribute('zone-key');

      if (anchor) {
        anchor.addEventListener('mouseenter', () => {
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

  document.querySelectorAll('.zone-detail-name').forEach(el => el.textContent = zone.fullName);
  document.querySelectorAll('.zone-detail-badge').forEach(el => {
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

export function initSweetAlertActions() {
  // Tidak perlu meng-override modal Bootstrap HTML bawaan
  // Biarkan modal Bootstrap asli yang kaya konteks tampil secara konsisten
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

document.addEventListener('DOMContentLoaded', () => {
  initTicketCountdown();
  initExploreFilters();
  initZoneDetail();
  initDynamicQRCode();
  initSweetAlertActions();
  initHistoryDataTable();
});
