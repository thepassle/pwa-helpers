import { expect, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import { addPwaUpdateListener } from '../index.js';

describe('addPwaUpdateListener', () => {
  it('executes a callback event when updatefound and statechange has been fired', async () => {
    const callback = sinon.spy();
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

    addPwaUpdateListener(callback);
    await nextFrame();
    expect(callback.calledOnce).to.be.equal(true);
  });

  it('is visible and fires a `pwa-update-available` event when there already is a waiting service worker', async () => {
    const callback = sinon.spy();
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

    addPwaUpdateListener(callback);
    await nextFrame();
    expect(callback.calledOnce).to.be.equal(true);
  });
});
