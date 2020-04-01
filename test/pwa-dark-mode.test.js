import { html, fixture, expect, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { PwaDarkMode } from '../pwa-dark-mode/PwaDarkMode.js';
import '../pwa-dark-mode.js';

describe('PwaDarkMode', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].classList.remove('dark');
  });

  it('renders a default slotted button', async () => {
    const el = await fixture(html`
      <pwa-dark-mode></pwa-dark-mode>
    `);

    expect(el.shadowRoot.querySelector('button').textContent).to.equal('Toggle darkmode');
  });

  it('toggles darkmode', async () => {
    const el = await fixture(html`
      <pwa-dark-mode></pwa-dark-mode>
    `);

    el.click();
    expect(localStorage.getItem('darkmode')).to.equal('true');
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
    el.click();
    expect(localStorage.getItem('darkmode')).to.equal('false');
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(false);
    el.click();
    expect(localStorage.getItem('darkmode')).to.equal('true');
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
  });

  describe('pwa-dark-mode callback', () => {
    it('renders a default slotted button', async () => {
      const callbackSpy = sinon.spy();
      const MyCustomDarkMode = defineCE(
        class extends PwaDarkMode {
          callback(darkMode) {
            callbackSpy(darkMode);
          }
        },
      );
      const el = await fixture(`<${MyCustomDarkMode}></${MyCustomDarkMode}>`);

      el.click();

      expect(callbackSpy.called).to.equal(true);
      expect(callbackSpy.calledWith(true)).to.equal(true);
      el.click();

      expect(callbackSpy.calledTwice).to.equal(true);
      expect(callbackSpy.calledWith(false)).to.equal(true);
    });
  });
});
