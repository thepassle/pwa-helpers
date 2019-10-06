import { html, fixture, expect } from '@open-wc/testing'; // eslint-disable-line
import sinon from 'sinon'; // eslint-disable-line

import '../pwa-update-available.js';

describe('PwaUpdateAvailable', () => {
  it('is hidasdasdden by default', async () => {
    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);

    expect(el).to.equal(el);
  });
});

/**
 * - is hidden by default
 * - shows slotted content
 * - posts message and becomes hidden
 * - should reload on controllerchange
 */
