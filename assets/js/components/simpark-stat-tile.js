// <simpark-stat-tile tone="blue|light" label="..." value="..."></simpark-stat-tile>
export class SimparkStatTile extends HTMLElement {
  connectedCallback() {
    const tone = this.getAttribute('tone') || 'light';
    const label = this.getAttribute('label') || '';
    const value = this.getAttribute('value') || '';

    this.innerHTML = `
      <div class="stat-tile tone-${tone}">
        <span class="stat-label">${label}</span>
        <span class="stat-value">${value}</span>
      </div>
    `;
  }
}
customElements.define('simpark-stat-tile', SimparkStatTile);
