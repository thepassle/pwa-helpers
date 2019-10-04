import { html, fixture, expect } from '@open-wc/testing';
import sinon from 'sinon';

import '../pwa-update-available/pwa-update-available.js';

describe('PwaUpdateAvailable', () => {
  it('is hidasdasdden by default', async () => {
    const el = await fixture(html`
      <pwa-update-available></pwa-update-available>
    `);
  });
});

/**
 * - is hidden by default
 * - shows slotted content
 * - posts message and becomes hidden
 * - should reload on controllerchange
 */