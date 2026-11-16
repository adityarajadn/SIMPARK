# SIMPARK-UB — Smart Parking Universitas Brawijaya

Prototipe web interaktif sistem rekomendasi & pemantauan parkir cerdas di lingkungan kampus **Universitas Brawijaya (UB)**. Proyek ini dikembangkan untuk keperluan tugas mata kuliah **Interaksi Manusia dan Komputer (IMK)** berdasarkan desain UI/UX di Figma.

---

## 🚀 Cara Menjalankan Proyek

Proyek ini adalah **aplikasi web statis murni** (Vanilla HTML5, CSS3, JavaScript ES Modules, dan Bootstrap 5 via CDN).
- **Tanpa instalasi Node.js atau `npm install`**.
- **Tanpa build-step** (tidak perlu Webpack/Vite).

### Menjalankan Langsung:
1. Buka folder proyek ini.
2. Klik dua kali file [`index.html`](index.html) untuk langsung membukanya di browser apa pun (Google Chrome, Edge, Firefox, dll), atau gunakan ekstensi *Live Server* di VS Code / editor Anda.

---

## 🗺️ Alur Pengguna (User Flow & Pages)

Proyek ini tersusun atas beberapa halaman yang saling terhubung mengikuti alur simulasi pengendara:

```text
[ Beranda ]                (index.html)
     │
     ├── Pilih Rekomendasi ───► [ Detail Zona ] (pages/detail.html?zone=A)
     │                                │
     │                                ├── Buat Tiket ──► [ Tiket Masuk ] (pages/ticket.html)
     │                                                        │
     │                                                        ├── Scan Masuk ──► [ Parkir Aktif ] (pages/active.html)
     │                                                                                │
     └── Pilih Manual ────────► [ Cari Parkir ] (pages/explore.html)                  └── Keluar ──► [ Riwayat ] (pages/history.html)
```

1. **`index.html` (Beranda / D01_Home)**: Rekomendasi zona parkir terbaik berdasarkan gedung tujuan (FILKOM), peta posisi zona, dan status kapasitas.
2. **`pages/explore.html` (Cari Parkir / D02_Explore)**: Daftar seluruh zona (A, B, C), pencarian gedung, filter ketersediaan (*Semua, Tersedia, Terbatas, Penuh*), dan peta simulasi besar.
3. **`pages/detail.html` (Detail Zona / D03_ZoneDetail)**: Rincian estimasi waktu perjalanan (*perjalanan, antrean, pencarian slot, jalan kaki*), ringkasan pilihan, dan modal konfirmasi pembuatan tiket.
4. **`pages/ticket.html` (Tiket Parkir & QR / D04_Ticket)**: Tiket QR simulasi dengan countdown timer aktif 10 menit, petunjuk pintu masuk, dan tombol simulasi scan masuk/gagal.
5. **`pages/active.html` (Parkir Aktif / D05_ActiveParking)**: Status kendaraan yang sedang terparkir, pencatat catatan lokasi spesifik, dan modal konfirmasi keluar parkir.
6. **`pages/history.html` (Riwayat Parkir / D06_History)**: Riwayat seluruh transaksi parkir sebelumnya dilengkapi ubin statistik performa.

---

## 📂 Struktur Proyek

```text
SIMPARK/
├── index.html                   # Halaman Utama (Beranda)
├── README.md                    # Dokumentasi & panduan proyek
├── pages/                       # Seluruh sub-halaman aplikasi
│   ├── explore.html             # Cari Parkir
│   ├── detail.html              # Detail Zona
│   ├── ticket.html               # Tiket & QR Code
│   ├── active.html              # Parkir Aktif
│   └── history.html             # Riwayat Parkir
└── assets/
    ├── css/                     # Modul styling CSS terpisah
    │   ├── style.css            # Main hub stylesheet
    │   ├── variables.css        # Warna, token desain Figma, dan tipografi
    │   ├── layout.css           # Header dan wrapper layout
    │   ├── components.css       # Styling tombol, badge, ubin metrik, alert, modal
    │   └── pages.css            # Styling peta simulasi, tiket, dan tabel
    ├── js/
    │   ├── data.js              # Data dummy/simulasi zona & rincian kuota
    │   ├── app.js               # Logika filter, countdown timer, query URL
    │   └── components/          # Reusable Web Components (Custom Elements)
    │       ├── index.js         # Registrasi komponen
    │       ├── simpark-header.js
    │       ├── simpark-badge.js
    │       ├── simpark-alert.js
    │       ├── simpark-stat-tile.js
    │       ├── simpark-zone-card.js
    │       ├── simpark-chip.js
    │       ├── simpark-input.js
    │       └── simpark-map.js
    └── img/                     # Aset gambar peta UB, QR code, dan ikon SVG
```

---

## 🎨 Desain Sistem & Framework
- **Font**: Google Font *Space Grotesk*.
- **Warna Identitas**: Biru UB (`#1763B1`), Aksen Emas/Kuning (`#FFCC33`), Hijau Sukses (`#237A49`), Merah Error (`#B42318`).
- **Framework UI**: Bootstrap 5 (Grid, Flexbox, Utilities, Modal).
