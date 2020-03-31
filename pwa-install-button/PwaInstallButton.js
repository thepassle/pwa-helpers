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

  connectedCallback() {
    this.setAttribute('hidden', '');
    this.addEventListener('click', this._handlePrompt.bind(this));

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      window.____pwa_install_button_deferred_prompt = e;
      this.removeAttribute('hidden');
      this.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
    });

    if (window.____pwa_install_button_installable) {
      this.removeAttribute('hidden');
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
