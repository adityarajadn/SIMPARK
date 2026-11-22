import { getQueryParam } from './utils.js';

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

  // Hubungkan tombol scan berhasil agar mengaktifkan sesi parkir di localStorage
  const scanSuccessBtn = document.getElementById('btn-scan-success');
  if (scanSuccessBtn) {
    scanSuccessBtn.href = `active.html?zone=${zoneKey}&ticketId=${ticketId}`;
    scanSuccessBtn.addEventListener('click', function () {
      const now = new Date();
      const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const activeData = {
        hasActive: true,
        ticketId: ticketId,
        zoneKey: zoneKey,
        entryTime: timeStr,
        startTime: Date.now()
      };
      localStorage.setItem('simpark_active_parking', JSON.stringify(activeData));
    });
  }
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
