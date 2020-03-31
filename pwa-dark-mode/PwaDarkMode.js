export class PwaDarkMode extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<slot><button>Toggle darkmode</button></slot>`;
  }

  connectedCallback() {
    this.addEventListener('click', this._toggleDarkMode.bind(this));
  }

  /* eslint-disable class-methods-use-this */
  _toggleDarkMode() {
    if (document.getElementsByTagName('html')[0].classList.contains('dark')) {
      document.getElementsByTagName('html')[0].classList.remove('dark');
      localStorage.setItem('darkmode', 'false');
    } else {
      document.getElementsByTagName('html')[0].classList.add('dark');
      localStorage.setItem('darkmode', 'true');
    }
  }
}
