# Dokumentasi Folder: `assets/css/`

Folder ini mengelola seluruh styling tampilan antarmuka SIMPARK-UB. Desain dibangun di atas kombinasi **CSS Modern (Variables / Design Tokens)** dan utilitas **Bootstrap 5**, disusun secara modular agar mudah dipelihara.

---

## 🎨 Arsitektur & Keterkaitan File CSS

Semua file HTML di proyek ini hanya perlu mengimpor satu file utama: [`style.css`](style.css). File tersebut bertindak sebagai *hub* yang mengimpor modul styling lainnya menggunakan aturan `@import`.

```mermaid
flowchart TD
    HTML["Halaman HTML<br>(index.html / pages/*.html)"]
    Style["style.css<br>(Main Hub)"]
    Variables["variables.css<br>(Warna, Typography, Elevation)"]
    Layout["layout.css<br>(Container, Header, App Structure)"]
    Components["components.css<br>(Buttons, Badges, Cards, Modals)"]
    Pages["pages.css<br>(Leaflet Map, QR Ticket, Tables)"]

    HTML -->|link rel=stylesheet| Style
    Style -->|@import| Variables
    Style -->|@import| Layout
    Style -->|@import| Components
    Style -->|@import| Pages
```

---

## 📄 Penjelasan Setiap File CSS

### 1. `variables.css`
- **Tanggung Jawab**: Mendefinisikan *Design Tokens* global aplikasi dalam `:root`.
- **Isi Konfigurasi**:
  - **Brand Colors**: `--brand-primary` (`#1763B1`), `--brand-secondary` (`#10447A`), `--accent-default` (`#FFB800`).
  - **Status Tones**:
    - Sukses / Tersedia: `--status-success-surface` (`#E6F4EA`), `--status-success-text` (`#137333`).
    - Peringatan / Terbatas: `--status-warning-surface` (`#FEF7E0`), `--status-warning-text` (`#B06000`).
    - Error / Penuh: `--status-error-surface` (`#FCE8E6`), `--status-error-text` (`#C5221F`).
  - **Borders & Radius**: `--radius-sm` (8px), `--radius-md` (16px), `--radius-lg` (24px).
  - **Typography**: Pengaturan font family *Space Grotesk*.

### 2. `layout.css`
- **Tanggung Jawab**: Menata struktur grid global, pembungkus kontainer aplikasi, dan navigasi navbar header (`<simpark-header>`).
- **Elemen Kunci**:
  - `.app-content`: Padding atas dan penataan container fluid aplikasi.
  - `.simpark-navbar`: Header fixed-top dengan background blur/transparan dan shadow halus.
  - Navigasi link aktif indikator.

### 3. `components.css`
- **Tanggung Jawab**: Menampung styling komponen-komponen UI atomik dan molekuler yang dipakai berulang kali.
- **Elemen Kunci**:
  - `.card-simpark`: Kartu rounded berbayang lembut dengan opsi hover `.interactive`.
  - `.btn-simpark-primary`, `.btn-simpark-secondary`, `.btn-simpark-accent`: Varian tombol utama, sekunder, dan aksen emas UB.
  - `.badge-simpark`: Badge status ketersediaan (*success, warning, error*).
  - `.chip-simpark`: Filter pill interaktif yang dapat diaktifkan (`.active`).
  - `.simpark-modal`: Penataan modal kustom untuk feedback sukses, konfirmasi, dan peringatan kegagalan.

### 4. `pages.css`
- **Tanggung Jawab**: Styling khusus untuk komponen halaman yang membutuhkan tata letak kompleks.
- **Elemen Kunci**:
  - **Halaman Tiket**: Styling visual kartu e-tiket, garis perforasi tiket, progress bar countdown, dan wrapper QR Code.
  - **Peta Leaflet**: Kustomisasi custom HTML marker pin (`.simpark-custom-pin`) untuk OpenStreetMap.
  - **Halaman Riwayat**: Styling penyesuaian DataTables agar selaras dengan desain Figma.

### 5. `style.css`
- **Tanggung Jawab**: File penggabung utama (`hub`). Memastikan urutan pemuatan gaya berjalan benar: variabel $\rightarrow$ layout $\rightarrow$ komponen $\rightarrow$ halaman spesifik.
