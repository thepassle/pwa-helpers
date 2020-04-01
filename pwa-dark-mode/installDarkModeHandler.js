const installMediaQueryWatcher = (mediaQuery, callback) => {
  const watchmedia = window.matchMedia(mediaQuery);
  watchmedia.addListener(e => callback(e.matches));
  callback(watchmedia.matches);
};

export function installDarkModeHandler(callback) {
  installMediaQueryWatcher(`(prefers-color-scheme: dark)`, preference => {
    const localStorageDarkmode = localStorage.getItem('darkmode');
    const darkmodePreferenceExists = localStorageDarkmode;
    const darkMode = localStorageDarkmode === 'true';

    /* on initial pageload, decide darkmode on users system preference */
    if (!darkmodePreferenceExists) {
      if (preference) {
        document.getElementsByTagName('html')[0].classList.add('dark');
        if (callback) callback(true);
      } else {
        document.getElementsByTagName('html')[0].classList.remove('dark');
        if (callback) callback(false); // eslint-disable-line
      }
    } else {
      /* on subsequent pageloads, decide darkmode on users chosen preference */
      /* eslint-disable no-lonely-if */
      if (darkMode) {
        document.getElementsByTagName('html')[0].classList.add('dark');
        if (callback) callback(true);
      }
    }
  });
}
