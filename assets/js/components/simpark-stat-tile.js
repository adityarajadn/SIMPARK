
export class SimparkStatTile extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'label', 'tone'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
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
