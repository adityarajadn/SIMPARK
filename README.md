# SIMPARK-UB — Smart Parking Universitas Brawijaya

Prototipe web interaktif sistem rekomendasi & pemantauan parkir cerdas di lingkungan kampus **Universitas Brawijaya (UB)**. Proyek ini dikembangkan untuk keperluan tugas mata kuliah **Interaksi Manusia dan Komputer (IMK)** berdasarkan desain UI/UX di Figma.

---

## 🚀 Cara Menjalankan Proyek

Proyek ini adalah **aplikasi web statis murni** (Vanilla HTML5, CSS3, JavaScript ES Modules, dan Bootstrap 5 via CDN).
- **Tanpa instalasi Node.js atau `npm install`**.
- **Tanpa build-step** (tidak perlu Webpack/Vite).

### Menjalankan lewat server lokal

Dari folder SIMPARK, jalankan perintah ini di PowerShell.

```powershell
py -m http.server 8000 --bind 127.0.0.1
```

Buka [http://127.0.0.1:8000](http://127.0.0.1:8000) di browser. VS Code Live Server juga bisa digunakan. Aplikasi memuat modul JavaScript dan data JSON lewat HTTP.

---

## 🗺️ Alur Pengguna (User Flow & Pages)

Proyek ini tersusun atas beberapa halaman yang saling terhubung mengikuti alur simulasi pengendara:

```text
[ Beranda ]                (index.html)
     │
     ├── Pilih Rekomendasi ───► [ Detail Zona ] (pages/detail.html?zone=A)
     │                                │
     │                                ├── Buat Tiket ──► [ Tiket Masuk ] (pages/ticket.html?ticket=...)
     │                                                        │
     │                                                        ├── Scan Masuk ──► [ Parkir Aktif ] (pages/active.html?ticket=...)
     │                                                                                │
     └── Pilih Manual ────────► [ Cari Parkir ] (pages/explore.html)                  └── Keluar ──► [ Riwayat ] (pages/history.html)
```

1. **`index.html` (Beranda / D01_Home)**: Rekomendasi otomatis berdasarkan gedung tujuan, estimasi waktu total, kapasitas, antrean, dan keandalan data.
2. **`pages/explore.html` (Cari Parkir / D02_Explore)**: Daftar dan peta zona, pilihan gedung, pencarian, filter ketersediaan, dan pengurutan berdasarkan waktu, slot, atau jarak.
3. **`pages/detail.html` (Detail Zona / D03_ZoneDetail)**: Rincian estimasi waktu perjalanan (*perjalanan, antrean, pencarian slot, jalan kaki*), ringkasan pilihan, dan modal konfirmasi pembuatan tiket.
4. **`pages/ticket.html` (Tiket Parkir & QR / D04_Ticket)**: Tiket QR simulasi dengan masa berlaku 10 menit dan pemeriksaan status serta kapasitas saat scan masuk.
5. **`pages/active.html` (Parkir Aktif / D05_ActiveParking)**: Status kendaraan, peta zona, catatan lokasi, dan konfirmasi scan keluar.
6. **`pages/history.html` (Riwayat Parkir / D06_History)**: Transaksi simulasi yang selesai di browser ini, beserta ringkasan dan pencarian.

---

## 🗺️ Integrasi Peta Interaktif Leaflet (`<simpark-map>`)

Komponen `<simpark-map>` menggunakan **Leaflet.js + OpenStreetMap** yang dipusatkan langsung ke area kampus **Universitas Brawijaya Malang** (`[-7.9535, 112.6144]`):
- **Peta Interaktif Penuh**: Pengguna dapat melakukan *pan*, *drag*, dan *zoom in/zoom out*.
- **Marker tujuan dan zona**: Warna marker zona mengikuti status kapasitas.
- **Pop-up zona**: Menampilkan slot, estimasi waktu, dan tautan arah ke titik masuk jika koordinat tersedia.

---

## Data dan Penyimpanan Simulasi

Edit [`assets/data/simpark-data.json`](assets/data/simpark-data.json) untuk mengganti data contoh.

- `gedung` berisi ID, nama, dan koordinat opsional. Entri pertama menjadi tujuan awal.
- `zona` berisi ID, nama, kapasitas, slot tersedia awal, hak akses, keandalan 0–100, dan koordinat titik masuk opsional.
- `estimasi` berisi satu entri untuk setiap pasangan `zonaId` dan `gedungId`, dengan empat komponen waktu dalam menit dan jarak opsional dalam meter.

Data gedung, kapasitas awal, dan koordinat adalah contoh simulasi. Pilihan tujuan, tiket, catatan lokasi, dan transaksi tersimpan di browser lewat `localStorage`. Saat berpindah alamat server atau browser, sesi simulasi menggunakan penyimpanan terpisah.

---

## 📚 Library Siap Pakai (Plug-and-Play CDN)

Aplikasi ini mengintegrasikan serangkaian library siap pakai via CDN tanpa build step:
1. **Leaflet.js & OpenStreetMap**: Peta interaktif UB dengan custom marker pin zona parkir.
2. **QRCode.js**: Generator QR berdasarkan ID tiket, zona, dan waktu terbit.
3. **DataTables.js**: Tabel riwayat dengan pencarian, pagination, dan pengurutan.
4. **Bootstrap Icons**: Ikon navigasi.

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
    │   └── pages.css            # Styling peta, tiket, dan tabel
    ├── data/simpark-data.json   # Gedung, zona, dan estimasi simulasi
    ├── js/
    │   ├── data.js              # Validasi data, kapasitas, dan rekomendasi
    │   ├── app.js               # Interaksi dan tampilan tiap halaman
    │   ├── parking.js           # Penyimpanan tiket dan transaksi
    │   └── components/          # Reusable Web Components (Custom Elements)
    │       ├── index.js         # Registrasi komponen
    │       ├── simpark-header.js
    │       ├── simpark-badge.js
    │       ├── simpark-alert.js
    │       ├── simpark-stat-tile.js
    │       ├── simpark-zone-card.js
    │       ├── simpark-chip.js
    │       ├── simpark-input.js
    │       └── simpark-map.js   # Peta Leaflet dan marker zona
    └── img/                     # Aset QR code dan ikon SVG
```

---

## 🎨 Desain Sistem & Framework
- **Font**: Google Font *Space Grotesk*.
- **Warna Identitas**: Biru UB (`#1763B1`), Aksen Emas/Kuning (`#FFCC33`), Hijau Sukses (`#237A49`), Merah Error (`#B42318`).
- **Framework UI**: Bootstrap 5 (Grid, Flexbox, Utilities, Modal) & Bootstrap Icons.
- **Peta**: Leaflet.js & OpenStreetMap.
- **Interaksi**: Dialog HTML, DataTables, QRCode.js.
