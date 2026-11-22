import { availableSlots } from './data.js';

export const storageKey = 'simpark.state.v1';
export const ticketDuration = 10 * 60 * 1000;

export function readParking() {
  const value = localStorage.getItem(storageKey);
  if (!value) return { destinationId: null, tickets: [] };
  const state = JSON.parse(value);
  if (!Array.isArray(state.tickets)) throw new Error('Data simulasi tidak valid');
  return state;
}

function updateParking(update) {
  const write = () => {
    const state = readParking();
    const result = update(state);
    if (!result.error) localStorage.setItem(storageKey, JSON.stringify(state));
    return result;
  };
  if (navigator.locks) return navigator.locks.request(storageKey, write);
  return write();
}

export function setDestination(destinationId) {
  return updateParking(state => {
    state.destinationId = destinationId;
    return {};
  });
}

export function ticketStatus(ticket, now = Date.now()) {
  if (ticket.status === 'issued' && now >= ticket.issuedAt + ticketDuration) return 'expired';
  return ticket.status;
}

function entryError(zone, tickets) {
  if (!zone.akses.includes('mahasiswa')) return 'Zona ini tidak dapat diakses mahasiswa.';
  if (availableSlots(zone, tickets) === 0) return 'Zona sudah penuh. Pilih zona lain dan cek kapasitas kembali.';
  return '';
}

export function issueTicket(zone, destinationId) {
  return updateParking(state => {
    const error = entryError(zone, state.tickets);
    if (error) return { error };

    let id;
    do {
      const bytes = crypto.getRandomValues(new Uint8Array(6));
      id = 'TKT-' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    } while (state.tickets.some(ticket => ticket.id === id));

    const ticket = { id, zoneId: zone.id, destinationId, issuedAt: Date.now(), status: 'issued' };
    state.tickets.push(ticket);
    return { ticket };
  });
}

export function scanEntry(ticketId, zone) {
  return updateParking(state => {
    const ticket = state.tickets.find(item => item.id === ticketId);
    if (!ticket || ticket.zoneId !== zone.id) return { error: 'Tiket tidak ditemukan.' };

    const now = Date.now();
    const status = ticketStatus(ticket, now);
    if (status === 'expired') return { error: 'Tiket kedaluwarsa. Cek kapasitas untuk membuat tiket baru.' };
    if (status !== 'issued') return { error: 'Tiket sudah digunakan.' };

    const error = entryError(zone, state.tickets);
    if (error) return { error };

    ticket.status = 'parked';
    ticket.enteredAt = now;
    return { ticket };
  });
}

export function scanExit(ticketId) {
  return updateParking(state => {
    const ticket = state.tickets.find(item => item.id === ticketId);
    if (ticket?.status !== 'parked') return { error: 'Tiket ini tidak memiliki parkir aktif.' };

    ticket.status = 'completed';
    ticket.exitedAt = Date.now();
    return { ticket };
  });
}

export function saveLocation(ticketId, note) {
  return updateParking(state => {
    const ticket = state.tickets.find(item => item.id === ticketId);
    if (ticket?.status !== 'parked') return { error: 'Catatan hanya dapat disimpan selama parkir aktif.' };

    ticket.note = note.trim();
    return { ticket };
  });
}
