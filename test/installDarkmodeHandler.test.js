import { expect } from '@open-wc/testing';
import { installDarkmodeHandler } from '../index.js';

describe('installDarkmodeHandler', () => {
  beforeEach(() => {
    localStorage.removeItem('darkmode');
    document.getElementsByTagName('html')[0].classList.remove('dark');
  });

  it('renders lightmode is the system preference is light', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        addListener: () => false,
      }),
    });
    installDarkmodeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(false);
  });

  it('renders darkmode is the system preference is dark', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: true,
        addListener: () => true,
      }),
    });
    installDarkmodeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
  });

  it('renders darkmode is the user preference is dark', async () => {
    localStorage.setItem('darkmode', 'true');
    installDarkmodeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
  });

  it('renders darkmode is the user preference is light', async () => {
    localStorage.setItem('darkmode', 'false');
    installDarkmodeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(false);
  });
});
