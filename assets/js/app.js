
import { ZONES } from './data.js';

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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

document.addEventListener('DOMContentLoaded', () => {
  initTicketCountdown();
  initExploreFilters();
  initZoneDetail();
});
