// <simpark-badge tone="success|warning|error|info" label="..."></simpark-badge>
export class SimparkBadge extends HTMLElement {
  connectedCallback() {
    const tone = this.getAttribute('tone') || 'info';
    const label = this.getAttribute('label') || '';
    
    let toneClass = 'badge-success-simpark';
    if (tone === 'warning') toneClass = 'badge-warning-simpark';
    else if (tone === 'error') toneClass = 'badge-error-simpark';
    else if (tone === 'info') toneClass = 'badge-simpark bg-light text-primary';

    this.innerHTML = `<span class="badge-simpark ${toneClass}">${label}</span>`;
  }
}
customElements.define('simpark-badge', SimparkBadge);
