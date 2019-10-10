import { html, fixture, expect } from '@open-wc/testing'; // eslint-disable-line
import sinon from 'sinon'; // eslint-disable-line

import '../pwa-update-available.js';

describe('PwaUpdateAvailable', () => {
  it('is hidden by default', async () => {
    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);

    expect(el.hidden).to.equal(true);
  });

  it('posts a message', async () => {
    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);
    el.hidden = false;
    el._newWorker = {
      postMessage: sinon.spy(),
    };
    el.click();
    expect(el._newWorker.postMessage).calledOnceWith('skipWaiting');
  });

  it('is visible when updatefound and statechange has been fired', async () => {
    const addEventListener = (_, cb) => cb();

    Object.defineProperty(window.navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: true,
        getRegistration: async () => ({
          installing: {
            state: 'installed',
            addEventListener,
          },
          addEventListener,
        }),
        addEventListener: () => {},
      },
    });

    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);

    expect(el.hidden).to.equal(false);
  });
});
