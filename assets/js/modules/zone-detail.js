import { ZONES } from '../data.js';
import { getQueryParam } from './utils.js';

export function initZoneDetail() {
  const zoneKey = getQueryParam('zone') || 'A';
  const zone = ZONES[zoneKey] || ZONES['A'];

  document.querySelectorAll('.zone-detail-name').forEach(function (el) {
    el.textContent = zone.fullName;
  });
  document.querySelectorAll('.zone-detail-badge').forEach(function (el) {
    el.className = `fw-bold text-dark zone-detail-badge fs-5`;
    el.textContent = `${zone.slotAvailable}/${zone.slotTotal} slot`;
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
