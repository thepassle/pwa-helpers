export class PwaUpdateAvailable extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<button><slot>New update available!</slot></button>`;
    this._refreshing = false;
  }

  connectedCallback() {
    this.addEventListener('click', this._postMessage.bind(this));
    this.setAttribute('hidden', '');

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg.addEventListener('updatefound', () => {
          this._newWorker = reg.installing;
          this._newWorker.addEventListener('statechange', () => {
            if (this._newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.removeAttribute('hidden');
            }
          });
        });
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (this._refreshing) return;
        window.location.reload();
        this._refreshing = true;
      });
    }
  }

  _postMessage(e) {
    e.preventDefault();
    this._newWorker.postMessage('skipWaiting');
  }
}
