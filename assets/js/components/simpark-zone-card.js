
export class SimparkZoneCard extends HTMLElement {
  connectedCallback() {
    const zoneKey = this.getAttribute('zone-key') || 'A';
    const name = this.getAttribute('name') || '';
    const statusTone = this.getAttribute('status-tone') || 'success';
    const statusText = this.getAttribute('status-text') || '';
    const estimate = this.getAttribute('estimate') || '';
    const slots = this.getAttribute('slots') || '';
    const queue = this.getAttribute('queue') || '';
    const href = this.getAttribute('href') || '#';
    const isSelected = this.getAttribute('selected') === 'true';

    let badgeClass = 'badge-success-simpark';
    if (statusTone === 'warning') badgeClass = 'badge-warning-simpark';
    else if (statusTone === 'error') badgeClass = 'badge-error-simpark';

    this.innerHTML = `
      <a href="${href}" class="text-decoration-none explore-zone-card d-block h-100" data-tone="${statusTone}">
        <div class="card-simpark interactive ${isSelected ? 'selected' : ''} h-100">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div class="text-overline" style="color: var(--text-link);">ZONA ${zoneKey}</div>
              <h3 class="title-h3 mb-0" style="font-size: 18px;">${name}</h3>
            </div>
            <span class="badge-simpark ${badgeClass}">${statusText}</span>
          </div>
          <div class="d-flex justify-content-between text-caption pt-2 border-top">
            <div>
              <div>Estimasi</div>
              <strong class="text-dark">${estimate}</strong>
            </div>
            <div>
              <div>Slot</div>
              <strong class="text-dark">${slots}</strong>
            </div>
            <div>
              <div>Antrean</div>
              <strong class="text-dark">${queue}</strong>
            </div>
          </div>
        </div>
      </a>
    `;
  }
}
customElements.define('simpark-zone-card', SimparkZoneCard);
