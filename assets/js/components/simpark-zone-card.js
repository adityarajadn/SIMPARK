export class SimparkZoneCard extends HTMLElement {
  connectedCallback() {
    const get = name => this.getAttribute(name) || '';
    this.innerHTML = `
      <a class="zone-card-link text-decoration-none d-block h-100">
        <div class="card-simpark interactive h-100">
          <div class="zone-card-heading mb-3">
            <div>
              <div class="text-overline zone-kicker"></div>
              <h3 class="title-h3 zone-name mb-0"></h3>
            </div>
            <span class="badge-simpark zone-status"></span>
          </div>
          <dl class="zone-card-metrics text-caption pt-2 border-top mb-0">
            <div><dt>Estimasi</dt><dd class="zone-time"></dd></div>
            <div><dt>Slot</dt><dd class="zone-slots"></dd></div>
            <div><dt>Antrean</dt><dd class="zone-queue"></dd></div>
          </dl>
        </div>
      </a>
    `;
    const fill = (selector, value) => this.querySelector(selector).textContent = value;
    this.querySelector('a').href = get('href');
    this.querySelector('.card-simpark').classList.toggle('selected', get('selected') === 'true');
    fill('.zone-kicker', 'Zona ' + get('zone-key'));
    fill('.zone-name', get('name'));
    fill('.zone-status', get('status-text'));
    const tone = get('status-tone');
    if (['success', 'warning', 'error'].includes(tone)) {
      this.querySelector('.zone-status').classList.add(`badge-${tone}-simpark`);
    }
    fill('.zone-time', get('estimate'));
    fill('.zone-slots', get('slots'));
    fill('.zone-queue', get('queue'));
  }
}

customElements.define('simpark-zone-card', SimparkZoneCard);
