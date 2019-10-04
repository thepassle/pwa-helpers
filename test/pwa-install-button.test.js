import { html, fixture, expect, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';

import '../pwa-install-button/pwa-install-button.js';

describe('PwaInstallButton', () => {
  it('is hidden by default', async () => {
    const el = await fixture(html`
      <pwa-install-button></pwa-install-button>
    `);

    expect(el.hidden).to.equal(true);
  });

  it('is visible when beforeinstallprompt has been fired', async () => {
    const el = await fixture(html`
      <pwa-install-button></pwa-install-button>
    `);

    window.dispatchEvent(new CustomEvent('beforeinstallprompt'));

    expect(el.hidden).to.equal(false);
  });

  it('uses default slotted content', async () => {
    const el = await fixture(html`
      <pwa-install-button></pwa-install-button>
    `);

    expect(el).shadowDom.to.equal('<slot><button>Install</button></slot>');
  });

  it('uses provided button element as slot', async () => {
    const el = await fixture(html`
      <pwa-install-button>
        <button>install me!</button>
      </pwa-install-button>
    `);

    expect(el).lightDom.to.equal('<button>install me!</button>');
  });

  it('becomes hidden when install prompt is accepted', async () => {
    const el = await fixture(html`
      <pwa-install-button></pwa-install-button>
    `);

    el._deferredPrompt = {
      prompt: sinon.spy(),
      userChoice: new Promise((res) => {
        res({
          outcome: 'accepted'
        })
      })
    }

    el.click();
    
    expect(el._deferredPrompt.prompt).called;
    expect(el.hidden).to.equal(true);
    await nextFrame();
    expect(el._deferredPrompt).to.equal(null);
  });

  it('stays visible when install prompt is declined', async () => {
    const el = await fixture(html`
      <pwa-install-button></pwa-install-button>
    `);
    el.removeAttribute('hidden');

    el._deferredPrompt = {
      prompt: sinon.spy(),
      userChoice: new Promise((res) => {
        res({
          outcome: 'declined'
        })
      })
    }

    el.click();
    expect(el._deferredPrompt.prompt).called;
    expect(el.hidden).to.equal(false);
  });
});
