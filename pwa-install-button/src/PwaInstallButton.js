export class PwaInstallButton extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      shadow.innerHTML = `<slot><button>Install</button></slot>`;
    }
  
    connectedCallback() {
      this.addEventListener('click', this._handlePrompt.bind(this));
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this._deferredPrompt = e;
        this.removeAttribute('hidden');
      });
  
      this.setAttribute('hidden', '');
    }
  
    async _handlePrompt(e) {
      e.preventDefault();
      this._deferredPrompt.prompt();
      const { outcome } = await this._deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        this.setAttribute('hidden', '');
        this._deferredPrompt = null;    
      }
    }
  }