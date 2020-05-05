window.____pwa_install_button_deferred_prompt = {};
window.____pwa_install_button_installable = null;

window.addEventListener('beforeinstallprompt', e => {
  window.____pwa_install_button_installable = true;
  window.____pwa_install_button_deferred_prompt = e;
});

export class PwaInstallButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<slot><button>Install</button></slot>`;
  }

  async connectedCallback() {
    this.setAttribute('hidden', '');
    this.addEventListener('click', this._handlePrompt.bind(this));

    let relatedApps = [];
    if ('getInstalledRelatedApps' in navigator) {
      relatedApps = await navigator.getInstalledRelatedApps();
    }
    const appAlreadyInstalled = relatedApps.length > 0;

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      if (!appAlreadyInstalled) {
        window.____pwa_install_button_deferred_prompt = e;
        this.removeAttribute('hidden');
        this.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
      }
    });

    if (window.____pwa_install_button_installable) {
      if (!appAlreadyInstalled) {
        this.removeAttribute('hidden');
      }
    }
  }

  async _handlePrompt(e) {
    e.preventDefault();
    window.____pwa_install_button_deferred_prompt.prompt();
    const { outcome } = await window.____pwa_install_button_deferred_prompt.userChoice;
    if (outcome === 'accepted') {
      this.dispatchEvent(new CustomEvent('pwa-installed', { detail: true }));
      this.setAttribute('hidden', '');
      window.____pwa_install_button_deferred_prompt = null;
    } else {
      this.dispatchEvent(new CustomEvent('pwa-installed', { detail: false }));
    }
  }
}
