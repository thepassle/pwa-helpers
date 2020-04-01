import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { installDarkModeHandler } from '../index.js';

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
    installDarkModeHandler();
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
    installDarkModeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
  });

  it('renders darkmode is the user preference is dark', async () => {
    localStorage.setItem('darkmode', 'true');
    installDarkModeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(true);
  });

  it('renders darkmode is the user preference is light', async () => {
    localStorage.setItem('darkmode', 'false');
    installDarkModeHandler();
    expect(document.getElementsByTagName('html')[0].classList.contains('dark')).to.equal(false);
  });

  describe('installDarkmodeHandler callback', () => {
    it('fires a callback on pageload if the system preference is dark', () => {
      const callback = sinon.stub();
      installDarkModeHandler(callback);
      expect(callback.called).to.equal(true);
      expect(callback.calledWith(true)).to.equal(true);
    });

    it('the callback passes true for darkMode if system preference is dark', () => {
      const callback = sinon.stub();
      installDarkModeHandler(darkMode => {
        if (darkMode) {
          callback(darkMode);
        }
      });
      expect(callback.called).to.equal(true);
      expect(callback.calledWith(true)).to.equal(true);
    });

    it('fires a callback on pageload if the preference is not dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => ({
          matches: false,
          addListener: () => false,
        }),
      });
      const callback = sinon.stub();
      installDarkModeHandler(callback);
      expect(callback.called).to.equal(true);
      expect(callback.calledWith(false)).to.equal(true);
    });

    it('the callback passes false for darkMode if system preference is dark', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: () => ({
          matches: false,
          addListener: () => false,
        }),
      });
      const callback = sinon.stub();
      installDarkModeHandler(darkMode => {
        if (!darkMode) {
          callback(darkMode);
        }
      });
      expect(callback.called).to.equal(true);
      expect(callback.calledWith(false)).to.equal(true);
    });
  });
});
