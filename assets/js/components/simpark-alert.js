// <simpark-alert tone="info|warning" title="..." body="..."></simpark-alert>
export class SimparkAlert extends HTMLElement {
  connectedCallback() {
    const tone = this.getAttribute('tone') || 'info';
    const title = this.getAttribute('title') || '';
    const body = this.getAttribute('body') || '';

    this.innerHTML = `
      <div class="alert-simpark tone-${tone} h-100">
        <div class="accent-bar"></div>
        <div>
          <div class="alert-title">${title}</div>
          <p class="alert-body">${body}</p>
        </div>
      </div>
    `;
  }
}
customElements.define('simpark-alert', SimparkAlert);
