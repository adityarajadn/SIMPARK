
export class SimparkInput extends HTMLElement {
  connectedCallback() {
    const placeholder = this.getAttribute('placeholder') || '';
    const initialValue = this.getAttribute('value') || '';
    const hasIcon = this.getAttribute('icon') === 'search';
    const hasChevron = this.getAttribute('chevron') === 'true';
    const width = this.getAttribute('style-width') || 'auto';
    const href = this.getAttribute('href') || '';
    const optionsAttr = this.getAttribute('options') || '';
    const rootPath = this.getAttribute('root-path') || './';

    const iconHtml = hasIcon ? `<i class="bi bi-search text-muted me-1" style="font-size: 16px;"></i>` : '';
    const chevronHtml = hasChevron ? `<i class="bi bi-chevron-down text-muted ms-1" style="font-size: 14px;"></i>` : '';

    if (href) {

      this.innerHTML = `
        <a href="${href}" class="custom-input text-decoration-none" style="width: ${width}; max-width: 100%;">
          ${iconHtml}
          <span class="flex-grow-1 text-truncate text-dark">${initialValue || placeholder}</span>
          ${chevronHtml}
        </a>
      `;
    } else if (hasChevron && optionsAttr) {

      const optionsList = optionsAttr.split(',').map(function (s) {
        return s.trim();
      });
      const dropdownId = 'dropdown-' + Math.random().toString(36).substring(2, 9);

      this.innerHTML = `
        <div class="dropdown d-inline-block" style="width: ${width}; max-width: 100%;">
          <button
            class="custom-input w-100 text-start bg-white d-flex align-items-center justify-content-between border-1"
            type="button"
            id="${dropdownId}"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style="width: 100%;">
            ${iconHtml}
            <span class="flex-grow-1 text-truncate text-dark selected-label">${initialValue || optionsList[0]}</span>
            ${chevronHtml}
          </button>
          <ul class="dropdown-menu shadow-sm rounded-4 border-0 p-2 mt-1" aria-labelledby="${dropdownId}" style="width: 100%; min-width: 180px;">
            ${optionsList.map(function (opt) {
              return `
              <li>
                <a class="dropdown-item rounded-3 py-2 ${opt === initialValue ? 'active fw-medium' : ''}" href="#" data-val="${opt}">
                  ${opt}
                </a>
              </li>
              `;
            }).join('')}
          </ul>
        </div>
      `;

      const self = this;
      const labelEl = this.querySelector('.selected-label');
      this.querySelectorAll('.dropdown-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
          e.preventDefault();
          const selectedVal = item.getAttribute('data-val');
          if (labelEl) labelEl.textContent = selectedVal;
          self.querySelectorAll('.dropdown-item').forEach(function (i) {
            i.classList.remove('active', 'fw-medium');
          });
          item.classList.add('active', 'fw-medium');

          self.dispatchEvent(new CustomEvent('change', { detail: { value: selectedVal } }));
        });
      });
    } else {

      this.innerHTML = `
        <div class="custom-input" style="width: ${width}; max-width: 100%;">
          ${iconHtml}
          ${initialValue ? `<span class="flex-grow-1 text-truncate text-dark">${initialValue}</span>` : `<input type="text" placeholder="${placeholder}" class="border-0 bg-transparent w-100" style="outline: none;">`}
          ${chevronHtml}
        </div>
      `;
    }
  }
}
customElements.define('simpark-input', SimparkInput);
