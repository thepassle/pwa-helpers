const installMediaQueryWatcher = (mediaQuery, callback) => {
  const watchmedia = window.matchMedia(mediaQuery);
  watchmedia.addListener(e => callback(e.matches));
  callback(watchmedia.matches);
};

export function installDarkModeHandler() {
  installMediaQueryWatcher(`(prefers-color-scheme: dark)`, preference => {
    const localStorageDarkmode = localStorage.getItem('darkmode');
    const darkmodePreferenceExists = localStorageDarkmode !== null;
    const darkMode = localStorageDarkmode === 'true';

    /* on initial pageload, decide darkmode on users system preference */
    if (!darkmodePreferenceExists) {
      if (preference) {
        localStorage.setItem('darkmode', 'true');
        document.getElementsByTagName('html')[0].classList.add('dark');
      } else {
        localStorage.setItem('darkmode', 'false');
      }
    } else {
      /* on subsequent pageloads, decide darkmode on users chosen preference */
      /* eslint-disable no-lonely-if */
      if (darkMode) {
        document.getElementsByTagName('html')[0].classList.add('dark');
      }
    }
  });
}
