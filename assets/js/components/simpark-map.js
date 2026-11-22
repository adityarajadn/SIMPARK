
export class SimparkMap extends HTMLElement {
  connectedCallback() {
    const height = this.getAttribute('height') || '300px';
    const rootPath = this.getAttribute('root-path') || './';
    const detailPrefix = rootPath === './' ? 'pages/detail.html' : 'detail.html';
    const mapImgPath = `${rootPath}assets/img/map-ub.png`;

    this.innerHTML = `
      <div class="map-simulated-container" style="height: ${height};">
        <img src="${mapImgPath}" class="map-bg" alt="Map UB" style="${height !== '300px' ? 'transform: scale(1.1);' : ''}">
        <a href="${detailPrefix}?zone=A" class="map-marker text-decoration-none" style="top: 45%; left: 48%;" title="Zona A">A</a>
        <a href="${detailPrefix}?zone=B" class="map-marker marker-b text-decoration-none" style="top: 60%; left: 70%;" title="Zona B">B</a>
        <a href="${detailPrefix}?zone=C" class="map-marker marker-c text-decoration-none" style="top: 30%; left: 30%;" title="Zona C">C</a>
      </div>
    `;
  }
}
customElements.define('simpark-map', SimparkMap);
