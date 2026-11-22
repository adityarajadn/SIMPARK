export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function initLiveDate() {
  const dateEl = document.getElementById('current-date-display');
  if (!dateEl) return;

  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  dateEl.textContent = new Intl.DateTimeFormat('id-ID', options).format(now);
}
