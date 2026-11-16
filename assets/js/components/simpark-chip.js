// <simpark-chip label="Semua" active="true|false" data-filter="all"></simpark-chip>
export class SimparkChip extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || '';
    const isActive = this.getAttribute('active') === 'true';
    const filter = this.getAttribute('data-filter') || '';

    this.innerHTML = `
      <span class="chip-simpark ${isActive ? 'active' : ''}" ${filter ? `data-filter="${filter}"` : ''}>
        ${label}
      </span>
    `;
  }
}
customElements.define('simpark-chip', SimparkChip);
