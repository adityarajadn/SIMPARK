import './components/index.js';
import { directionsUrl, loadParkingData, parkingOptions, recommend, zoneTitle } from './data.js';
import {
  issueTicket, readParking, saveLocation, scanEntry, scanExit, setDestination,
  storageKey, ticketDuration, ticketStatus
} from './parking.js';

const main = document.querySelector('main[data-page]');
const params = new URLSearchParams(location.search);
const appRoot = new URL('../../', import.meta.url);
const timeFormat = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
const dateFormat = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium' });

const element = id => document.getElementById(id);
const text = (id, value) => {
  const target = element(id);
  if (target.textContent !== value) target.textContent = value;
};
const visible = (id, show) => { element(id).hidden = !show; };
const minutes = value => value === null || value === undefined ? '—' : `${value} menit`;
const clockTime = timestamp => timeFormat.format(timestamp).replace('.', ':');
const slotCount = option => `${option.available} / ${option.zone.kapasitasTotal}`;
const statusLabel = option => `${option.capacity.label} · ${option.available} slot`;

function durationLabel(milliseconds) {
  const totalMinutes = Math.floor(milliseconds / 60000);
  if (totalMinutes < 1) return '< 1 menit';
  if (totalMinutes < 60) return minutes(totalMinutes);
  return `${Math.floor(totalMinutes / 60)} j ${totalMinutes % 60} m`;
}

function pageUrl(page, parameters = {}) {
  const url = new URL(page, appRoot);
  url.search = new URLSearchParams(parameters);
  return url.href;
}

function link(id, url) {
  const anchor = element(id);
  if (url) anchor.href = url;
  else anchor.removeAttribute('href');
  visible(id, Boolean(url));
}

function notice(id, message) {
  text(id, message);
  visible(id, Boolean(message));
}

function badge(id, label, tone) {
  const target = element(id);
  target.className = `badge-simpark badge-${tone}-simpark`;
  text(id, label);
  visible(id, true);
}

async function runAction(button, action, noticeId) {
  if (button.disabled) return;
  button.disabled = true;
  button.dataset.pending = 'true';
  notice(noticeId, '');
  try {
    const result = await action();
    if (result.error) notice(noticeId, result.error);
    else return result;
  } catch {
    notice(noticeId, 'Perubahan gagal disimpan. Cek pengaturan penyimpanan browser dan coba lagi.');
  } finally {
    delete button.dataset.pending;
    button.disabled = false;
  }
}

function currentDestination(data, state, requested = params.get('destination')) {
  return data.gedung.find(building => building.id === requested)
    || data.gedung.find(building => building.id === state.destinationId)
    || data.gedung[0];
}

function destinationPicker(data, refresh) {
  const select = element('destination');
  select.replaceChildren(...data.gedung.map(building => new Option(building.nama, building.id)));

  async function selectDestination(buildingId) {
    try {
      await setDestination(buildingId);
      const url = new URL(location.href);
      url.searchParams.set('destination', buildingId);
      history.replaceState(null, '', url);
      params.set('destination', buildingId);
      refresh();
      notice('app-status', '');
    } catch {
      notice('app-status', 'Tujuan gagal disimpan. Coba lagi setelah penyimpanan browser tersedia.');
    }
  }

  select.addEventListener('change', () => selectDestination(select.value));
  return selectDestination;
}

function zoneCards(containerId, options, destinationId, selectedId) {
  const cards = options.map(option => {
    const card = document.createElement('simpark-zone-card');
    const attributes = {
      'zone-key': option.zone.id,
      name: option.zone.nama,
      'status-text': statusLabel(option),
      'status-tone': option.capacity.tone,
      estimate: minutes(option.totalTime),
      slots: slotCount(option),
      queue: minutes(option.estimate?.antreMenit),
      selected: String(option.zone.id === selectedId),
      href: pageUrl('pages/detail.html', { zone: option.zone.id, destination: destinationId })
    };
    for (const [name, value] of Object.entries(attributes)) card.setAttribute(name, value);
    return card;
  });
  element(containerId).replaceChildren(...cards);
}

function initHome(data) {
  destinationPicker(data, render);
  const map = main.querySelector('simpark-map');

  function render() {
    const state = readParking();
    const destination = currentDestination(data, state);
    const options = parkingOptions(data, destination.id, state.tickets);
    const best = recommend(options);
    element('destination').value = destination.id;
    link('manual-link', pageUrl('pages/explore.html', { destination: destination.id }));
    visible('recommendation-label', Boolean(best));
    visible('recommendation-metrics', Boolean(best));
    visible('recommendation-capacity', Boolean(best));
    if (best) {
      text('recommendation-title', zoneTitle(best.zone));
      text('recommendation-reason', `Estimasi ke ${destination.nama} ${minutes(best.totalTime)}, dengan antrean ${minutes(best.estimate.antreMenit)}.`);
      text('recommendation-time', minutes(best.totalTime));
      text('recommendation-slots', slotCount(best));
      text('recommendation-queue', minutes(best.estimate.antreMenit));
      badge('recommendation-capacity', statusLabel(best), best.capacity.tone);
      link('recommendation-link', pageUrl('pages/detail.html', { zone: best.zone.id, destination: destination.id }));
    } else {
      text('recommendation-title', 'Belum ada rekomendasi zona');
      text('recommendation-reason', 'Cek kapasitas dan estimasi melalui pilihan parkir manual.');
      link('recommendation-link', '');
    }

    const alternatives = options.filter(option => option.zone.id !== best?.zone.id);
    visible('alternatives', alternatives.length > 0);
    zoneCards('alternative-zones', alternatives, destination.id);
    map.update(destination, options);
    const parked = state.tickets.findLast(ticket => ticket.status === 'parked');
    const issued = state.tickets.findLast(ticket => ticketStatus(ticket) === 'issued');
    const resume = parked || issued;
    link('resume-parking', resume && pageUrl(parked ? 'pages/active.html' : 'pages/ticket.html', { ticket: resume.id }));
    if (resume) text('resume-parking', parked ? 'Lihat Parkir Aktif' : 'Lihat Tiket Aktif');
  }

  return render;
}

function initExplore(data) {
  let filter = 'all';
  const search = element('zone-search');
  const sort = element('zone-sort');
  const map = main.querySelector('simpark-map');
  const filters = [...main.querySelectorAll('button[data-filter]')];
  const selectDestination = destinationPicker(data, render);

  function renderResults() {
    const state = readParking();
    const destination = currentDestination(data, state);
    const options = parkingOptions(data, destination.id, state.tickets);
    const query = search.value.trim().toLocaleLowerCase('id');
    const matches = data.gedung.filter(building => query && building.nama.toLocaleLowerCase('id').includes(query));
    const buildingMatches = matches.map(building => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip-simpark';
      button.textContent = `Tujuan: ${building.nama}`;
      button.addEventListener('click', () => {
        search.value = '';
        selectDestination(building.id);
      });
      return button;
    });
    element('matching-buildings').replaceChildren(...buildingMatches);

    const results = options.filter(option => (filter === 'all' || option.capacity.tone === filter)
      && zoneTitle(option.zone).toLocaleLowerCase('id').includes(query));

    const sortValue = {
      time: option => option.totalTime ?? Infinity,
      slots: option => -option.available,
      distance: option => option.estimate?.jarakKeGedungMeter ?? Infinity
    }[sort.value];

    results.sort((a, b) => sortValue(a) - sortValue(b) || a.zone.id.localeCompare(b.zone.id));
    zoneCards('zone-results', results, destination.id, recommend(options)?.zone.id);
    text('zone-count', results.length ? `${results.length} zona ditemukan` : 'Tidak ada zona yang cocok.');
    return { destination, options };
  }

  function render() {
    const { destination, options } = renderResults();
    element('destination').value = destination.id;
    map.update(destination, options);
  }

  search.addEventListener('input', renderResults);
  sort.addEventListener('change', renderResults);
  for (const button of filters) {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      for (const chip of filters) {
        const selected = chip === button;
        chip.classList.toggle('active', selected);
        chip.setAttribute('aria-pressed', selected);
      }
      renderResults();
    });
  }

  return render;
}

function initDetail(data) {
  const zoneId = params.get('zone') || data.zona[0]?.id;
  const zone = data.zona.find(item => item.id === zoneId);
  const dialog = element('confirm-ticket-dialog');
  const open = element('open-ticket-confirmation');
  const confirm = element('confirm-ticket');
  const map = main.querySelector('simpark-map');
  let destination;

  open.addEventListener('click', () => {
    notice('issue-error', '');
    dialog.showModal();
  });
  confirm.addEventListener('click', async () => {
    const result = await runAction(confirm, () => issueTicket(zone, destination.id), 'issue-error');
    if (result) location.href = pageUrl('pages/ticket.html', { ticket: result.ticket.id });
  });

  return () => {
    const state = readParking();
    destination = currentDestination(data, state);
    link('back-to-explore', pageUrl('pages/explore.html', { destination: destination.id }));
    if (!zone) {
      text('detail-zone', 'Zona tidak ditemukan');
      visible('detail-capacity', false);
      return;
    }

    const options = parkingOptions(data, destination.id, state.tickets);
    const option = options.find(item => item.zone.id === zone.id);
    const isRecommended = recommend(options)?.zone.id === zone.id;
    const unavailable = !option.accessible ? 'Zona ini tidak dapat diakses mahasiswa.'
      : option.available === 0 ? 'Zona penuh. Cek kapasitas atau pilih zona lain.' : '';
    const { estimate } = option;

    visible('detail-content', true);
    text('detail-zone', zoneTitle(zone));
    badge('detail-capacity', statusLabel(option), option.capacity.tone);
    text('detail-destination', destination.nama);
    text('zone-detail-slot', slotCount(option));
    text('zone-detail-queue', minutes(estimate?.antreMenit));
    text('zone-detail-total-time', minutes(option.totalTime));
    text('breakdown-travel', minutes(estimate?.keZonaMenit));
    text('breakdown-queue', minutes(estimate?.antreMenit));
    text('breakdown-search', minutes(estimate?.cariSlotMenit));
    text('breakdown-walk', minutes(estimate?.jalanKakiMenit));
    notice('detail-reason', isRecommended
      ? 'Direkomendasikan berdasarkan waktu total, slot, antrean, dan keandalan data.'
      : estimate ? '' : 'Estimasi perjalanan ke gedung ini belum tersedia.');
    notice('detail-unavailable', unavailable);
    open.disabled = Boolean(unavailable);
    text('confirm-zone', zoneTitle(zone));
    text('confirm-destination', destination.nama);
    link('detail-directions', directionsUrl(zone));
    map.update(destination, options, zone.id);
  };
}

function initTicket(data) {
  const ticketId = params.get('ticket');
  const scan = element('scan-entry');
  const qr = element('simpark-qrcode');
  let currentTicket;
  let zone;

  scan.addEventListener('click', async () => {
    const result = await runAction(scan, () => scanEntry(ticketId, zone), 'scan-error');
    if (result) location.href = pageUrl('pages/active.html', { ticket: result.ticket.id });
    else render();
  });

  function updateClock(ticket) {
    const remaining = ticketStatus(ticket) === 'issued'
      ? Math.max(0, Math.ceil((ticket.issuedAt + ticketDuration - Date.now()) / 1000)) : 0;
    const pad = value => String(value).padStart(2, '0');
    text('ticket-countdown-timer', `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`);
    element('ticket-progress-bar').value = remaining;
    return remaining;
  }

  function render() {
    const state = readParking();
    const ticket = state.tickets.find(item => item.id === ticketId);
    currentTicket = ticket;
    zone = data.zona.find(item => item.id === ticket?.zoneId);
    if (!ticket || !zone) {
      notice('ticket-message', 'Tiket tidak ditemukan di browser ini. Pilih zona untuk membuat tiket baru.');
      visible('ticket-content', false);
      visible('ticket-status', false);
      return;
    }

    const destination = data.gedung.find(item => item.id === ticket.destinationId);
    const expiresAt = ticket.issuedAt + ticketDuration;
    const status = ticketStatus(ticket);
    const issued = status === 'issued';
    const used = status === 'parked' || status === 'completed';


    visible('ticket-content', true);
    text('ticket-id', ticket.id);
    text('ticket-zone', zoneTitle(zone));
    text('ticket-gate', zoneTitle(zone));
    text('ticket-destination', destination?.nama || '—');
    text('ticket-issued', `${clockTime(ticket.issuedAt)} WIB`);
    text('ticket-expires', `${clockTime(expiresAt)} WIB`);
    updateClock(ticket);

    // A pending scan remains disabled until its storage transaction returns.
    scan.disabled = !issued || scan.dataset.pending === 'true';
    badge('ticket-status', issued ? 'Aktif · Belum digunakan' : used ? 'Sudah digunakan' : 'Kedaluwarsa',
      issued ? 'success' : 'error');
    notice('ticket-message', used ? 'Tiket sudah digunakan dan tidak dapat dipindai ulang.'
      : issued ? '' : 'Tiket kedaluwarsa. Cek kapasitas untuk membuat tiket baru.');
    if (!issued) notice('scan-error', '');
    link('ticket-explore', pageUrl('pages/explore.html', destination ? { destination: destination.id } : {}));
    link('ticket-directions', directionsUrl(zone));
    link('view-active', used && pageUrl('pages/active.html', { ticket: ticket.id }));
    text('view-active', status === 'completed' ? 'Lihat Transaksi' : 'Lihat Parkir Aktif');

    if (issued && window.QRCode && !qr.childElementCount) {
      new QRCode(qr, {
        text: `SIMPARK-UB:${ticket.id}:ZONE-${ticket.zoneId}:TIMESTAMP-${ticket.issuedAt}`,
        width: 170,
        height: 170,
        colorDark: '#1763b1',
        correctLevel: QRCode.CorrectLevel.M
      });
      qr.querySelector('img')?.setAttribute('alt', `QR tiket ${ticket.id}`);
    }
    visible('qr-wrap', issued && !!qr.childElementCount);
    visible('qr-error', issued && !qr.childElementCount);
  }

  setInterval(() => {
    if (currentTicket && zone && !scan.disabled && updateClock(currentTicket) === 0) render();
  }, 1000);
  return render;
}

function initActive(data) {
  let ticketId = params.get('ticket');
  const save = element('save-location');
  const input = element('location-note');
  const confirm = element('confirm-exit');
  const dialog = element('confirm-exit-dialog');
  const map = main.querySelector('simpark-map');
  let currentId;
  let mappedOption;

  element('location-form').addEventListener('submit', async event => {
    event.preventDefault();
    const result = await runAction(save, () => saveLocation(currentId, input.value), 'note-message');
    if (result) {
      input.value = result.ticket.note;
      notice('note-message', 'Catatan lokasi tersimpan.');
    }
  });

  element('open-exit-confirmation').addEventListener('click', () => {
    notice('exit-error', '');
    dialog.showModal();
  });
  confirm.addEventListener('click', async () => {
    const result = await runAction(confirm, () => scanExit(currentId), 'exit-error');
    if (result) {
      dialog.close();
      render();
      element('active-heading').focus();
    }
  });

  function render() {
    const state = readParking();
    const ticket = ticketId ? state.tickets.find(item => item.id === ticketId)
      : state.tickets.findLast(item => item.status === 'parked');
    const zone = data.zona.find(item => item.id === ticket?.zoneId);
    const parked = ticket?.status === 'parked';
    const completed = ticket?.status === 'completed';
    if (!zone || (!parked && !completed)) {
      notice('active-message', 'Belum ada parkir aktif. Scan tiket yang valid untuk mencatat kendaraan masuk.');
      visible('active-status', false);
      visible('active-content', false);
      visible('active-explore', true);
      return;
    }

    const destination = data.gedung.find(item => item.id === ticket.destinationId);
    if (!ticketId) {
      ticketId = ticket.id;
      history.replaceState(null, '', pageUrl('pages/active.html', { ticket: ticketId }));
    }
    if (currentId !== ticket.id) input.value = ticket.note || '';
    currentId = ticket.id;
    visible('active-content', true);
    visible('active-status', true);
    visible('active-explore', false);
    visible('location-form', parked);
    if (!parked) visible('note-message', false);
    visible('exit-time-row', completed);
    visible('open-exit-confirmation', parked);
    visible('view-history', completed);
    text('active-heading', completed ? 'Parkir selesai' : 'Parkir Aktif');
    text('active-status', completed ? 'Transaksi selesai' : 'Scan masuk berhasil');
    notice('active-message', completed
      ? 'Verifikasi keluar berhasil. Slot dikembalikan dan transaksi tersimpan di riwayat.'
      : `Kendaraan tercatat di ${zoneTitle(zone)}.`);
    text('active-id', ticket.id);
    text('exit-ticket', ticket.id);
    text('active-zone', zoneTitle(zone));
    text('active-destination', destination?.nama || '—');
    text('active-entered', `${clockTime(ticket.enteredAt)} WIB`);
    text('active-exited', completed ? `${clockTime(ticket.exitedAt)} WIB` : '');
    text('active-duration', durationLabel((ticket.exitedAt ?? Date.now()) - ticket.enteredAt));
    const options = parkingOptions(data, destination?.id, state.tickets);
    const selected = options.find(option => option.zone.id === ticket.zoneId);
    const markerKey = JSON.stringify([ticket.id, selected.available]);
    if (markerKey !== mappedOption) {
      map.update(destination, [selected], ticket.zoneId);
      mappedOption = markerKey;
    }
  }

  return render;
}

function initHistory(data) {
  const table = element('simpark-history-datatable');
  let dataTable;

  return () => {
    const tickets = readParking().tickets.filter(ticket => ticket.status === 'completed')
      .sort((a, b) => b.exitedAt - a.exitedAt);
    visible('history-content', tickets.length > 0);
    visible('history-empty', tickets.length === 0);
    if (!tickets.length) return;

    const counts = new Map();
    let totalDuration = 0;
    const rows = tickets.map(ticket => {
      counts.set(ticket.zoneId, (counts.get(ticket.zoneId) || 0) + 1);
      totalDuration += ticket.exitedAt - ticket.enteredAt;
      const zone = data.zona.find(item => item.id === ticket.zoneId);
      const row = document.createElement('tr');
      for (const value of [
        ticket.id, zone ? zoneTitle(zone) : `Zona ${ticket.zoneId}`, dateFormat.format(ticket.enteredAt),
        clockTime(ticket.enteredAt), clockTime(ticket.exitedAt), 'Selesai'
      ]) row.insertCell().textContent = value;
      row.cells[2].dataset.order = ticket.enteredAt;
      return row;
    });

    const favorite = [...counts].sort((a, b) => b[1] - a[1])[0][0];
    text('history-total', `${tickets.length} kali`);
    text('history-favorite', `Zona ${favorite}`);
    text('history-duration', durationLabel(totalDuration / tickets.length));
    if (dataTable) {
      dataTable.clear().rows.add(rows).draw(false);
      return;
    }
    table.tBodies[0].replaceChildren(...rows);
    if (window.DataTable) {
      dataTable = new DataTable(table, {
        order: [],
        pageLength: 5,
        lengthMenu: [5, 10, 25],
        language: {
          search: 'Cari riwayat',
          searchPlaceholder: 'ID tiket atau zona',
          lengthMenu: 'Tampilkan _MENU_ baris',
          info: 'Menampilkan _START_–_END_ dari _TOTAL_ transaksi',
          infoEmpty: 'Tidak ada transaksi yang cocok',
          infoFiltered: '(dari _MAX_ transaksi)',
          zeroRecords: 'Tidak ada data riwayat yang cocok',
          paginate: { previous: 'Sebelumnya', next: 'Berikutnya' }
        }
      });
    }
  };
}

async function initialize() {
  const views = { home: initHome, explore: initExplore, detail: initDetail, ticket: initTicket, active: initActive, history: initHistory };
  let data;
  try {
    data = await loadParkingData();
  } catch {
    notice('app-status', 'Data parkir gagal dimuat. Periksa koneksi atau server lokal, lalu muat ulang halaman.');
    return;
  }

  const content = main.querySelector('[data-content]');
  const render = views[main.dataset.page](data);
  function refresh() {
    try {
      content.hidden = false;
      render();
      notice('app-status', '');
    } catch (error) {
      content.hidden = true;
      notice('app-status', 'Simulasi parkir gagal dimuat. Periksa penyimpanan browser dan muat ulang halaman.');
      console.error(error);
    }
  }

  refresh();
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) refresh();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) refresh();
  });
}

initialize();
