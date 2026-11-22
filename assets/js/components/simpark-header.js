
export class SimparkHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || 'home';
    const rootPath = this.getAttribute('root-path') || './';

    const homeUrl = rootPath === './' ? 'index.html' : '../index.html';
    const exploreUrl = rootPath === './' ? 'pages/explore.html' : 'explore.html';
    const historyUrl = rootPath === './' ? 'pages/history.html' : 'history.html';

    this.innerHTML = `
      <header class="container-xxl mt-2 mt-md-3">
        <div class="app-header d-flex align-items-center justify-content-between">
          <a href="${homeUrl}" class="text-decoration-none">
            <div class="brand-title">SIMPARK-UB</div>
            <div class="brand-subtitle">Smart Parking UB</div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="d-none d-md-flex gap-2">
            <a href="${homeUrl}" class="nav-item-btn ${active === 'home' ? 'active' : ''}"><i class="bi bi-house-door me-1"></i> Beranda</a>
            <a href="${exploreUrl}" class="nav-item-btn ${active === 'explore' ? 'active' : ''}"><i class="bi bi-geo-alt me-1"></i> Cari Parkir</a>
            <a href="${historyUrl}" class="nav-item-btn ${active === 'history' ? 'active' : ''}"><i class="bi bi-clock-history me-1"></i> Riwayat</a>
          </nav>

          <!-- Mobile Hamburger Toggle Button -->
          <button class="navbar-toggler-simpark d-flex d-md-none align-items-center justify-content-center"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileSidebar"
                  aria-controls="mobileSidebar"
                  aria-label="Toggle navigation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Mobile Offcanvas Sidebar -->
        <div class="offcanvas offcanvas-end simpark-sidebar" tabindex="-1" id="mobileSidebar" aria-labelledby="mobileSidebarLabel">
          <div class="offcanvas-header border-bottom pb-3">
            <div>
              <div class="brand-title" id="mobileSidebarLabel">SIMPARK-UB</div>
              <div class="brand-subtitle">Smart Parking UB</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body pt-3">
            <nav class="d-flex flex-column gap-2">
              <a href="${homeUrl}" class="nav-item-btn w-100 justify-content-start ${active === 'home' ? 'active' : ''}"><i class="bi bi-house-door me-2"></i> Beranda</a>
              <a href="${exploreUrl}" class="nav-item-btn w-100 justify-content-start ${active === 'explore' ? 'active' : ''}"><i class="bi bi-geo-alt me-2"></i> Cari Parkir</a>
              <a href="${historyUrl}" class="nav-item-btn w-100 justify-content-start ${active === 'history' ? 'active' : ''}"><i class="bi bi-clock-history me-2"></i> Riwayat</a>
            </nav>
          </div>
        </div>
      </header>
    `;
  }
}
customElements.define('simpark-header', SimparkHeader);
