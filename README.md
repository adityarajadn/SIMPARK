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

1. **`index.html` (Beranda / D01_Home)**: Rekomendasi zona parkir terbaik berdasarkan gedung tujuan (FILKOM), Google Maps interaktif UB, dan status kapasitas.
2. **`pages/explore.html` (Cari Parkir / D02_Explore)**: Daftar seluruh zona (A, B, C), pencarian gedung, filter ketersediaan (*Semua, Tersedia, Terbatas, Penuh*), dan Google Maps terintegrasi.
3. **`pages/detail.html` (Detail Zona / D03_ZoneDetail)**: Rincian estimasi waktu perjalanan (*perjalanan, antrean, pencarian slot, jalan kaki*), ringkasan pilihan, dan modal konfirmasi pembuatan tiket.
4. **`pages/ticket.html` (Tiket Parkir & QR / D04_Ticket)**: Tiket QR simulasi dengan countdown timer aktif 10 menit, petunjuk pintu masuk, dan tombol simulasi scan masuk/gagal.
5. **`pages/active.html` (Parkir Aktif / D05_ActiveParking)**: Status kendaraan yang sedang terparkir, lokasi di Google Maps, pencatat catatan lokasi spesifik, dan modal konfirmasi keluar parkir.
6. **`pages/history.html` (Riwayat Parkir / D06_History)**: Riwayat seluruh transaksi parkir sebelumnya dilengkapi ubin statistik performa.

---

## 🗺️ Integrasi Peta Interaktif Leaflet (`<simpark-map>`)

Komponen `<simpark-map>` menggunakan **Leaflet.js + OpenStreetMap** yang dipusatkan langsung ke area kampus **Universitas Brawijaya Malang** (`[-7.9535, 112.6144]`):
- **Peta Interaktif Penuh**: Pengguna dapat melakukan *pan*, *drag*, dan *zoom in/zoom out*.
- **Custom Interactive Markers**:
  - 📍 **Gedung F — FILKOM** (Marker biru UB tujuan pengendara)
  - 🟢 **Zona A — Parkir Teknik Utara** (Marker hijau rekomendasi utama, 45 slot tersedia)
  - 🟡 **Zona B — Parkir FIB Barat** (Marker kuning/oranye alternatif, 12 slot tersedia)
  - 🔴 **Zona C — Parkir Samantha Krida** (Marker merah penuh, 0 slot)
- **Pop-up Informasi**: Mengklik setiap pin akan menampilkan popup rincian kuota slot dan estimasi waktu.

---

## 📚 Library Siap Pakai (Plug-and-Play CDN)

Aplikasi ini mengintegrasikan serangkaian library siap pakai via CDN tanpa build step:
1. **Leaflet.js & OpenStreetMap**: Peta interaktif UB dengan custom marker pin zona parkir.
2. **SweetAlert2**: Notifikasi modal & konfirmasi interaktif untuk pembuatan tiket serta penyelesaian parkir.
3. **QRCode.js**: Generator QR Code dinamis berbasis teks tiket parkir.
4. **DataTables.js**: Tabel riwayat transaksi dengan live filter search, pagination, dan column sorting.
5. **Bootstrap Icons**: Koleksi ikon antarmuka modern dan tajam untuk navigasi dan input.

---

## 📂 Struktur Proyek

```text
SIMPARK/
├── index.html                   # Halaman Utama (Beranda)
├── README.md                    # Dokumentasi & panduan proyek
├── pages/                       # Seluruh sub-halaman aplikasi
│   ├── explore.html             # Cari Parkir
│   ├── detail.html              # Detail Zona
│   ├── ticket.html              # Tiket & QR Code
│   ├── active.html              # Parkir Aktif
│   └── history.html             # Riwayat Parkir
└── assets/
    ├── css/                     # Modul styling CSS terpisah
    │   ├── style.css            # Main hub stylesheet
    │   ├── variables.css        # Warna, token desain Figma, dan tipografi
    │   ├── layout.css           # Header dan wrapper layout
    │   ├── components.css       # Styling tombol, badge, ubin metrik, alert, modal
    │   └── pages.css            # Styling peta Google Maps, tiket, dan tabel
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
    │       └── simpark-map.js   # Komponen Google Maps Embed + Pin Marker
    └── img/                     # Aset QR code dan ikon SVG
```

---

## 🎨 Desain Sistem & Framework
- **Font**: Google Font *Space Grotesk*.
- **Warna Identitas**: Biru UB (`#1763B1`), Aksen Emas/Kuning (`#FFCC33`), Hijau Sukses (`#237A49`), Merah Error (`#B42318`).
- **Framework UI**: Bootstrap 5 (Grid, Flexbox, Utilities, Modal) & Bootstrap Icons.
- **Peta**: Leaflet.js & OpenStreetMap.
- **Interaksi**: SweetAlert2, DataTables, QRCode.js.
