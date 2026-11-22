
export class SimparkHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute('active') || 'home';
    const rootPath = this.getAttribute('root-path') || './';

    const homeUrl = rootPath === './' ? 'index.html' : '../index.html';
    const exploreUrl = rootPath === './' ? 'pages/explore.html' : 'explore.html';
    const historyUrl = rootPath === './' ? 'pages/history.html' : 'history.html';

    this.innerHTML = `
      <header class="container-xxl mt-3">
        <div class="app-header d-flex align-items-center justify-content-between">
          <a href="${homeUrl}" class="text-decoration-none">
            <div class="brand-title">SIMPARK-UB</div>
            <div class="brand-subtitle">Smart Parking UB</div>
          </a>
          <nav class="d-flex gap-2">
            <a href="${homeUrl}" class="nav-item-btn ${active === 'home' ? 'active' : ''}">Beranda</a>
            <a href="${exploreUrl}" class="nav-item-btn ${active === 'explore' ? 'active' : ''}">Cari Parkir</a>
            <a href="${historyUrl}" class="nav-item-btn ${active === 'history' ? 'active' : ''}">Riwayat</a>
          </nav>
        </div>
      </header>
    `;
  }
}
customElements.define('simpark-header', SimparkHeader);
