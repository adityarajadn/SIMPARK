
export class SimparkInput extends HTMLElement {
  connectedCallback() {
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const hasIcon = this.getAttribute('icon') === 'search';
    const hasChevron = this.getAttribute('chevron') === 'true';
    const width = this.getAttribute('style-width') || 'auto';
    const href = this.getAttribute('href') || '';
    const rootPath = this.getAttribute('root-path') || './';

    const searchIconPath = `${rootPath}assets/img/search-icon.svg`;
    const chevronPath = `${rootPath}assets/img/chevron.svg`;

    const iconHtml = hasIcon ? `<img src="${searchIconPath}" width="20" height="20" alt="Search">` : '';
    const chevronHtml = hasChevron ? `<img src="${chevronPath}" width="20" height="20" alt="Select">` : '';

    if (href) {
      this.innerHTML = `
        <a href="${href}" class="custom-input text-decoration-none" style="width: ${width};">
          ${iconHtml}
          <span class="flex-grow-1 text-truncate text-dark">${value || placeholder}</span>
          ${chevronHtml}
        </a>
      `;
    } else {
      this.innerHTML = `
        <div class="custom-input" style="width: ${width};">
          ${iconHtml}
          ${value ? `<span class="flex-grow-1 text-truncate text-dark">${value}</span>` : `<input type="text" placeholder="${placeholder}" class="border-0 bg-transparent w-100" style="outline: none;">`}
          ${chevronHtml}
        </div>
      `;
    }
  }
}
customElements.define('simpark-input', SimparkInput);
