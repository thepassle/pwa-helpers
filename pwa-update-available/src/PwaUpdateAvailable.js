export class PwaUpdateAvailable extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<button><slot>New update available!</slot></button>`;
  }

  connectedCallback() {
    this.addEventListener('click', this._postMessage.bind(this));
    this.setAttribute('hidden', '');

    if('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        reg.addEventListener('updatefound', () => {
          this._newWorker = reg.installing;
          this._newWorker.addEventListener('statechange', () => {
            if(this._newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.removeAttribute('hidden');
            }
          });
        });
      });

      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });
    }
  }

  _postMessage(e) {
    e.preventDefault();
    this._newWorker.postMessage({ action: 'skipWaiting' });
  }
}
