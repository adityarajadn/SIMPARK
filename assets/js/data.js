export async function loadParkingData() {
  const response = await fetch(new URL('../data/simpark-data.json', import.meta.url));
  if (!response.ok) throw new Error('Data parkir tidak tersedia');
  const data = await response.json();
  if (!validParkingData(data)) throw new Error('Format data parkir tidak valid');
  return data;
}

function validParkingData(data) {
  if (!Array.isArray(data?.gedung) || !data.gedung.length
    || !Array.isArray(data.zona) || !Array.isArray(data.estimasi)) return false;

  const nonnegative = value => Number.isFinite(value) && value >= 0;
  const validPoint = point => point == null || (Number.isFinite(point.latitude)
    && Math.abs(point.latitude) <= 90 && Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180);
  const validEntity = item => typeof item?.id === 'string' && item.id.trim()
    && typeof item.nama === 'string' && item.nama.trim();
  const buildings = new Set(data.gedung.map(item => item?.id));
  const zones = new Set(data.zona.map(item => item?.id));
  const pairs = new Set();

  return buildings.size === data.gedung.length && zones.size === data.zona.length
    && data.gedung.every(item => validEntity(item) && validPoint(item.koordinat))
    && data.zona.every(zone => validEntity(zone) && validPoint(zone.titikMasuk) && Array.isArray(zone.akses)
      && Number.isInteger(zone.kapasitasTotal) && zone.kapasitasTotal > 0
      && Number.isInteger(zone.slotTersediaAwal) && zone.slotTersediaAwal >= 0
      && zone.slotTersediaAwal <= zone.kapasitasTotal
      && nonnegative(zone.keandalanData) && zone.keandalanData <= 100)
    && data.estimasi.every(estimate => {
      if (!zones.has(estimate?.zonaId) || !buildings.has(estimate?.gedungId)) return false;
      const pair = JSON.stringify([estimate.zonaId, estimate.gedungId]);
      if (pairs.has(pair)) return false;
      pairs.add(pair);
      return [estimate.keZonaMenit, estimate.antreMenit, estimate.cariSlotMenit, estimate.jalanKakiMenit].every(nonnegative)
        && (estimate.jarakKeGedungMeter == null || nonnegative(estimate.jarakKeGedungMeter));
    });
}

const scoringWeights = { time: 0.4, slots: 0.3, queue: 0.2, reliability: 0.1 };

export function zoneTitle(zone) {
  return `Zona ${zone.id} — ${zone.nama}`;
}

export function capacityStatus(available, total) {
  const ratio = available / total;
  if (ratio > 0.3) return { tone: 'success', label: 'Tersedia' };
  if (ratio >= 0.05) return { tone: 'warning', label: 'Terbatas' };
  return { tone: 'error', label: available > 0 ? 'Hampir penuh' : 'Penuh' };
}

export function availableSlots(zone, tickets) {
  const occupied = tickets.filter(ticket => ticket.zoneId === zone.id && ticket.status === 'parked').length;
  return Math.max(0, zone.slotTersediaAwal - occupied);
}

export function parkingOptions(data, buildingId, tickets) {
  const estimates = new Map(data.estimasi
    .filter(estimate => estimate.gedungId === buildingId)
    .map(estimate => [estimate.zonaId, estimate]));

  return data.zona.map(zone => {
    const estimate = estimates.get(zone.id);
    const available = availableSlots(zone, tickets);
    return {
      zone,
      estimate,
      available,
      capacity: capacityStatus(available, zone.kapasitasTotal),
      accessible: zone.akses.includes('mahasiswa'),
      totalTime: estimate ? estimate.keZonaMenit + estimate.antreMenit + estimate.cariSlotMenit + estimate.jalanKakiMenit : null
    };
  });
}

export function recommend(options) {
  const eligible = options.filter(option => option.accessible && option.available > 0 && option.estimate);
  if (!eligible.length) return undefined;
  const minTime = Math.min(...eligible.map(option => option.totalTime));
  const maxTime = Math.max(...eligible.map(option => option.totalTime));
  const timeRange = maxTime - minTime || 1;
  const maxSlots = Math.max(1, ...eligible.map(option => option.available));
  const maxQueue = Math.max(1, ...eligible.map(option => option.estimate.antreMenit));

  return eligible.map(option => ({
    option,
    score: scoringWeights.time * (1 - (option.totalTime - minTime) / timeRange)
      + scoringWeights.slots * option.available / maxSlots
      + scoringWeights.queue * (1 - option.estimate.antreMenit / maxQueue)
      + scoringWeights.reliability * option.zone.keandalanData / 100
  })).sort((a, b) => b.score - a.score || a.option.totalTime - b.option.totalTime)[0]?.option;
}

export function directionsUrl(zone) {
  if (!zone.titikMasuk) return '';
  const { latitude, longitude } = zone.titikMasuk;
  const url = new URL('https://www.google.com/maps/dir/');
  url.search = new URLSearchParams({ api: '1', destination: `${latitude},${longitude}` });
  return url.href;
}
