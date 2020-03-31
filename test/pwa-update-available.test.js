import { html, fixture, expect, oneEvent, fixtureSync } from '@open-wc/testing';
import sinon from 'sinon';

import '../pwa-update-available.js';

describe('PwaUpdateAvailable', () => {
  it('is hidden by default', () => {
    const el = fixtureSync(html`
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
    expect(el._newWorker.postMessage).calledOnceWith({ type: 'SKIP_WAITING' });
  });

  it('is visible and fires a `pwa-update-available` event when updatefound and statechange has been fired', async () => {
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

    const el = document.createElement('pwa-update-available');
    setTimeout(async () => {
      await el.connectedCallback();
    });
    const { detail } = await oneEvent(el, 'pwa-update-available');

    expect(detail).to.equal(true);
    expect(el.hidden).to.equal(false);
  });

  it('is visible and fires a `pwa-update-available` event when there already is a waiting service worker', async () => {
    const addEventListener = (_, cb) => cb();

    Object.defineProperty(window.navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: true,
        getRegistration: async () => ({
          installing: {
            state: 'not installed',
            addEventListener,
          },
          waiting: true,
          addEventListener,
        }),
        addEventListener: () => {},
      },
    });

    const el = document.createElement('pwa-update-available');
    setTimeout(async () => {
      await el.connectedCallback();
    });
    const { detail } = await oneEvent(el, 'pwa-update-available');

    expect(detail).to.equal(true);
    expect(el.hidden).to.equal(false);
  });

  it('doesnt throw an error when there reg is undefined', async () => {
    Object.defineProperty(window.navigator, 'serviceWorker', {
      writable: true,
      value: {
        getRegistration: async () => undefined,
      },
    });

    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);

    expect(el._newWorker).to.equal(undefined);
    expect(el.hidden).to.equal(true);
  });

  it('refreshes the page after controllerchange', async () => {
    const addEventListener = (_, cb) => cb();

    Object.defineProperty(window.navigator, 'serviceWorker', {
      writable: true,
      value: {
        controller: true,
        getRegistration: async () => ({
          installing: {
            state: 'not installed',
            addEventListener,
          },
          waiting: true,
          addEventListener,
        }),
        addEventListener,
      },
    });

    const el = document.createElement('pwa-update-available');
    el._refreshing = true;
    setTimeout(async () => {
      await el.connectedCallback();
    });
    const { detail } = await oneEvent(el, 'pwa-update-available');

    expect(detail).to.equal(true);
    expect(el.hidden).to.equal(false);
  });
});
