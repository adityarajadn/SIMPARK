
export class SimparkHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || 'home';
    const rootPath = this.getAttribute('root-path') || './';

    const homeUrl = rootPath === './' ? 'index.html' : '../index.html';
    const exploreUrl = rootPath === './' ? 'pages/explore.html' : 'explore.html';
    const activeUrl = rootPath === './' ? 'pages/active.html' : 'active.html';
    const historyUrl = rootPath === './' ? 'pages/history.html' : 'history.html';

    this.innerHTML = `
      <!-- Top Header (Desktop Only) -->
      <header class="container-xxl mt-2 mt-md-3 d-none d-md-block">
        <div class="app-header d-flex align-items-center justify-content-between">
          <a href="${homeUrl}" class="text-decoration-none">
            <div class="brand-title">SIMPARK-UB</div>
            <div class="brand-subtitle">Smart Parking UB</div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="d-flex gap-2">
            <a href="${homeUrl}" class="nav-item-btn ${active === 'home' ? 'active' : ''}"><i class="bi bi-house-door me-1"></i> Beranda</a>
            <a href="${exploreUrl}" class="nav-item-btn ${active === 'explore' ? 'active' : ''}"><i class="bi bi-geo-alt me-1"></i> Cari Parkir</a>
            <a href="${activeUrl}" class="nav-item-btn ${active === 'active' ? 'active' : ''}"><i class="bi bi-p-circle me-1"></i> Parkiran Aktif</a>
            <a href="${historyUrl}" class="nav-item-btn ${active === 'history' ? 'active' : ''}"><i class="bi bi-clock-history me-1"></i> Riwayat</a>
          </nav>
        </div>
      </header>

      <!-- Mobile Bottom Navigation Bar -->
      <nav class="simpark-bottom-nav d-flex d-md-none">
        <a href="${homeUrl}" class="bottom-nav-item ${active === 'home' ? 'active' : ''}">
          <i class="bi bi-house-door bottom-nav-icon"></i>
          <span class="bottom-nav-label">Beranda</span>
        </a>
        <a href="${exploreUrl}" class="bottom-nav-item ${active === 'explore' ? 'active' : ''}">
          <i class="bi bi-geo-alt bottom-nav-icon"></i>
          <span class="bottom-nav-label">Cari</span>
        </a>
        <a href="${activeUrl}" class="bottom-nav-item ${active === 'active' ? 'active' : ''}">
          <i class="bi bi-p-circle bottom-nav-icon"></i>
          <span class="bottom-nav-label">Aktif</span>
        </a>
        <a href="${historyUrl}" class="bottom-nav-item ${active === 'history' ? 'active' : ''}">
          <i class="bi bi-clock-history bottom-nav-icon"></i>
          <span class="bottom-nav-label">Riwayat</span>
        </a>
      </nav>
    `;
  }
}
customElements.define('simpark-header', SimparkHeader);
