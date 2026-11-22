
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
  if (!filterChips.length) return;

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

export function initZoneDetail() {
  const zoneKey = getQueryParam('zone') || 'A';
  const zone = ZONES[zoneKey] || ZONES['A'];

  document.querySelectorAll('.zone-detail-name').forEach(el => el.textContent = zone.fullName);
  document.querySelectorAll('.zone-detail-badge').forEach(el => {
    el.className = `badge-simpark ${zone.badgeClass}`;
    el.textContent = zone.statusText;
  });

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
}

export function initSweetAlertActions() {
  if (typeof Swal === 'undefined') return;

  const triggerBtn = document.querySelector('[data-bs-target="#confirmTicketModal"]');
  if (triggerBtn) {
    triggerBtn.removeAttribute('data-bs-toggle');
    triggerBtn.removeAttribute('data-bs-target');
    triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const zoneKey = getQueryParam('zone') || 'A';
      const zone = ZONES[zoneKey] || ZONES['A'];

      Swal.fire({
        title: 'Konfirmasi Buat Tiket?',
        html: `
          <div class="text-start p-2" style="font-size: 15px;">
            <p class="mb-1"><strong>Tujuan:</strong> Gedung F — FILKOM</p>
            <p class="mb-1"><strong>Zona:</strong> ${zone.fullName}</p>
            <p class="mb-2"><strong>Masa Berlaku:</strong> 10 Menit</p>
            <div class="alert alert-warning py-2 mb-0" style="font-size: 13px;">
              <i class="bi bi-info-circle me-1"></i> Tiket bukan reservasi slot tetap. Slot berkurang setelah scan gerbang masuk.
            </div>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#1763B1',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bi bi-ticket-perforated me-1"></i> Buat Tiket Sekarang',
        cancelButtonText: 'Batal'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `ticket.html?zone=${zoneKey}`;
        }
      });
    });
  }

  const checkoutBtn = document.querySelector('[data-bs-target="#checkoutModal"]');
  if (checkoutBtn) {
    checkoutBtn.removeAttribute('data-bs-toggle');
    checkoutBtn.removeAttribute('data-bs-target');
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Swal.fire({
        title: 'Selesaikan & Keluar Parkir?',
        html: `
          <div class="text-start p-2" style="font-size: 15px;">
            <p class="mb-1"><strong>Zona:</strong> Zona A — Teknik Utara</p>
            <p class="mb-1"><strong>Durasi:</strong> 1 jam 12 menit</p>
            <p class="mb-2 text-success"><strong>Biaya Parkir:</strong> Rp 0 (Gratis Mahasiswa UB)</p>
          </div>
        `,
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#1763B1',
        cancelButtonColor: '#6c757d',
        confirmButtonText: '<i class="bi bi-box-arrow-right me-1"></i> Ya, Selesai Keluar',
        cancelButtonText: 'Tetap Parkir'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Berhasil Keluar!',
            text: 'Terima kasih telah menggunakan SIMPARK-UB.',
            icon: 'success',
            timer: 1800,
            showConfirmButton: false
          }).then(() => {
            window.location.href = 'history.html';
          });
        }
      });
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

document.addEventListener('DOMContentLoaded', () => {
  initTicketCountdown();
  initExploreFilters();
  initZoneDetail();
  initDynamicQRCode();
  initSweetAlertActions();
  initHistoryDataTable();
});
