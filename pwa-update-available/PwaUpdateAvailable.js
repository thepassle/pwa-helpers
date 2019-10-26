export class PwaUpdateAvailable extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<button><slot>New update available!</slot></button>`;
    this._refreshing = false;
  }

  async connectedCallback() {
    this.addEventListener('click', this._postMessage.bind(this));
    this.setAttribute('hidden', '');

    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();

      reg.addEventListener('updatefound', () => {
        this._newWorker = reg.installing;
        this._newWorker.addEventListener('statechange', () => {
          if (this._newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.dispatchEvent(new CustomEvent('pwa-update-available', { detail: true }));
            this.removeAttribute('hidden');
          }
        });

        if (reg.waiting && navigator.serviceWorker.controller) {
          this.dispatchEvent(new CustomEvent('pwa-update-available', { detail: true }));
          this._newWorker = reg.waiting;
          this.removeAttribute('hidden');
        }
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
    this._newWorker.postMessage({ type: 'SKIP_WAITING' });
  }
}
