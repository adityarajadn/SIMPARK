
export const ZONES = {
  A: {
    id: "Zona A",
    fullName: "Zona A — Parkir Teknik Utara",
    slotTotal: 100,
    slotAvailable: 45,
    statusText: "Tersedia · 45 slot",
    statusTone: "success",
    timeMinutes: 8,
    queue: "Rendah",
    desc: "Dipilih karena waktu total tercepat ke Gedung F FILKOM, slot masih lega, dan antrean rendah.",
    badgeClass: "badge-success-simpark",
    destBuilding: "Gedung F — FILKOM",
    breakdown: {
      travel: "3 menit",
      queue: "1 menit",
      searchSlot: "2 menit",
      walk: "2 menit"
    }
  },
  B: {
    id: "Zona B",
    fullName: "Zona B — Parkir FILKOM Selatan",
    slotTotal: 80,
    slotAvailable: 12,
    statusText: "Terbatas · 12 slot",
    statusTone: "warning",
    timeMinutes: 9,
    queue: "Sedang",
    desc: "Alternatif terdekat kedua dengan kapasitas sedang menuju FILKOM.",
    badgeClass: "badge-warning-simpark",
    destBuilding: "Gedung F — FILKOM",
    breakdown: {
      travel: "4 menit",
      queue: "2 menit",
      searchSlot: "2 menit",
      walk: "1 menit"
    }
  },
  C: {
    id: "Zona C",
    fullName: "Zona C — Parkir Gedung Rektorat",
    slotTotal: 60,
    slotAvailable: 0,
    statusText: "Penuh · 0 slot",
    statusTone: "error",
    timeMinutes: 11,
    queue: "Tinggi",
    desc: "Zona saat ini penuh karena aktivitas di area rektorat.",
    badgeClass: "badge-error-simpark",
    destBuilding: "Gedung F — FILKOM",
    breakdown: {
      travel: "4 menit",
      queue: "4 menit",
      searchSlot: "1 menit",
      walk: "2 menit"
    }
  }
};
