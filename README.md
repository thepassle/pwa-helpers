# Pwa Helper Components

> This webcomponent follows [open-wc](https://www.open-wc.org/) recommendations.

These are some utilities for common patterns that help you build your [Progressive Web App](https://developers.google.com/web/progressive-web-apps) (PWA). Not to be confused with [`@polymer/pwa-helpers`](https://www.npmjs.com/package/pwa-helpers).

If you're new to building Progressive Web Apps, we recommend you read the [Offline Cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook) by [Jake Archibald](https://twitter.com/jaffathecake), or take the free Udacity course at [Offline Web Applications](https://www.udacity.com/course/offline-web-applications--ud899).

Other useful resources for developing Progressive Web Apps are:
- [Workbox](https://developers.google.com/web/tools/workbox) - Workbox is a set of libraries and Node modules that make it easy to cache assets and take full advantage of features used to build Progressive Web Apps.
- [serviceworke.rs](https://serviceworke.rs/) - Common Service Worker patterns
- [Service Workies](https://serviceworkies.com/) - Learn Service Workers inside and out with this game of Service Worker mastery
- [PWA Builder Feature Store](https://www.pwabuilder.com/features) - Common recipes for building PWA's

## Installation

Installation:
```bash
npm i --save pwa-helper-components
```

Importing like this will self register the web component:
```js
import 'pwa-helper-components/pwa-install-button.js';
import 'pwa-helper-components/pwa-update-available.js';
```

If you want more control over the registration of the component, you can import the class and handle registration yourself:
```js
import { PwaInstallButton, PwaUpdateAvailable } from 'pwa-helper-components';

customElements.define('my-install-button', PwaInstallButton);
customElements.define('my-update-available', PwaUpdateAvailable);
```

Or via [unpkg](https://unpkg.com):
```js
import 'https://unpkg.com/pwa-helper-components/pwa-install-button.js';
import 'https://unpkg.com/pwa-helper-components/pwa-update-available.js';

// or:

import { PwaInstallButton, PwaUpdateAvailable } from 'https://unpkg.com/pwa-helper-components/index.js';
```

## `<pwa-install-button>`

`<pwa-install-button>` is a zero dependency web component that lets users easily add a install button to their PWA.

You can find a live demo [here](https://unpkg.com/pwa-helper-components@0.1.3/demo/index.html). (Note: it may take a few seconds before the buttons become visible, because the `beforeinstallprompt` may not have fired yet)

`<pwa-install-button>` will have a `hidden` attribute until the [`beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) event is fired. It will hold on to the event, so the user can click the button whenever they are ready to install your app. It will also hold on to the event even if the user has declined the initial prompt. If they decline to install your app, and leave your page it may take some time before the browser sends another [`beforeinstallprompt`](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) again. See the FAQ for more information.

### Usage

You can provide your own button as a child of the `<pwa-install-button>`, or use the default (white-label) fallback button.

```html
<!-- Will use a slotted default fallback button -->
<pwa-install-button>
</pwa-install-button>
```

```html
<!-- Will use the provided button element -->
<pwa-install-button>
    <button>Install!</button>
</pwa-install-button>
```

You can also use a Web Component:
```html
<pwa-install-button>
    <mwc-button>Install!</mwc-button>
</pwa-install-button>
```

Instead of only showing a button, you can also make a custom app listing experience, as long as it contains a button:

```html
<pwa-install-button>
  <img src="./app-logo.png"/>
  <h1>MyApp</h1>
  <h2>Key features:</h2>
  <ul>
    <li>Fast</li>
    <li>Reliable</li>
    <li>Offline first</li>
  </ul>
  <h2>Description:</h2>
  <p>MyApp is an awesome Progressive Web App!</p>
  <button>Install!</button>
</pwa-install-button>
```

Do note that you may want to defer the `<pwa-install-button>` becoming visible if you choose a pattern like this, as it may be obstructive to your user. You can do this by overriding the default `[hidden]` styling, and listening for the `pwa-installable` event.

### Events

`<pwa-install-button>` will fire a `pwa-intallable` event when it becomes installable, and a `pwa-installed` event when the user has installed your PWA. If the user has dismissed the prompt, a `pwa-installed` event will be fired with a false value.

You can listen to these events like this:

```js
const pwaInstallButton = document.querySelector('pwa-install-button');

// The app is installable
pwaInstallButton.addEventListener('pwa-installable', (event) => {
  console.log(event.detail); // true
});

// User accepted the prompt
pwaInstallButton.addEventListener('pwa-installed', (event) => {
  console.log(event.detail); // true
  // You may want to use this event to send some data to your analytics
});

// If the user dismisses the prompt
pwaInstallButton.addEventListener('pwa-installed', (event) => {
  console.log(event.detail); // false
});
```


### Requirements

Make sure your PWA meets the installable criteria, which you can find  [here](https://developers.google.com/web/fundamentals/app-install-banners/). You can find a tool to generate your `manifest.json` [here](https://www.pwabuilder.com/generate).

## `<pwa-update-available>`

> 🚨 This web component may require a small addition to your service worker if you're not using workbox 🚨

`<pwa-update-available>` is a zero dependency web component that lets users easily show a 'update available' notification.

`<pwa-update-available>` will have a `hidden` attribute until the [updatefound](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration#Examples) notification is sent, and the new service worker is succesfully installed.

Clicking the `<pwa-update-available>` component will [post a message](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) to your service worker with a `{type: 'SKIP_WAITING'}` object, which lets your new service worker call `skipWaiting` and then reload the page on `controllerchange`.

Instructions on how to catch this message in your service worker are described down below.

### Usage:

```html
<!-- Will use the default slot fallback button -->
<pwa-update-available>
</pwa-update-available>
```

```html
<!-- Will use the provided button element -->
<pwa-update-available>
  <button>A new update is available! Click here to update.</button>
</pwa-update-available>
```

The next thing to do is update your service worker to listen for the `message` event. To add this snippet of code to your service worker, you can do the following:

#### Using Workbox

If you're using workbox, no changes are required, as workbox automatically includes the necessary code in your generated service worker.

#### Manual approach

If you're manually writing your service worker, you can simply copy the code snippet down below anywhere in the global scope of your service worker.

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
```

`skipWaiting` will refresh any open tabs/clients.

Prior art by:
- [Deanhume](https://github.com/deanhume/pwa-update-available/blob/master/index.html)
- [Morbidick](https://github.com/morbidick/serviceworker-helpers/blob/master/sw-update-toast.html)
- [Workbox Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users)

### Events

`<pwa-update-available>` will fire a `pwa-update-available` event when a update is available.

You can listen to this event like this:

```js
const pwaUpdateAvailable = document.querySelector('pwa-update-available');

pwaUpdateAvailable.addEventListener('pwa-update-available', (event) => {
  console.log(event.detail); // true
});
```

If you're interested in reading more about this subject, you can check out this blog: [How to Fix the Refresh Button When Using Service Workers](https://redfin.engineering/how-to-fix-the-refresh-button-when-using-service-workers-a8e27af6df68).

## FAQ

### Why is my install button not showing up on subsequent visits?

The [BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) may not immediately be fired if the user has initially declined the prompt. This is intentional behavior left that way to avoid web pages annoying the users to repeatedly prompt the user for adding to home screen. `<pwa-install-button>` will hold on to the event, even if the user declined to install the app; if they change their mind, they will still be able to click the button. The button may not be immediately visible on subsequent visits though; this is intended browser behavior.

Different browsers may use a different heuristic to fire subsequent BeforeInstallPromptEvents.

### `skipWaiting` doesn't work!

Your service worker may not call `skipWaiting` if there are tasks that are still running, like for example Event Sources, which are used by, for example, the `--watch` mode of [`es-dev-server`](https://open-wc.org/developing/es-dev-server.html#getting-started) in order to reload the page on file changes.

If you want to test your service worker with your production build, you can remove the `--watch` flag from your [`es-dev-server`](https://open-wc.org/developing/es-dev-server.html#getting-started) script, or you can run a simple http-server with `npx http-server` on your `/dist` folder to make sure everything works as expected.


### Single Page Apps

When developing single page applications, make sure to have a `<base href="/">` element in your index.html, and return your index.html in your service worker. 

#### Using Workbox

If you're using Workbox, you can register a navigation route like so:

```js
workbox.routing.registerNavigationRoute(
  // Assuming '/single-page-app.html' has been precached,
  // look up its corresponding cache key.
  workbox.precaching.getCacheKeyForURL('/single-page-app.html')
);
```

You can read more about this approach [here](https://developers.google.com/web/tools/workbox/modules/workbox-routing#how_to_register_a_navigation_route).


#### Manual approach

If you're not using Workbox, you can use the following code snippet in your service worker's `fetch` handler:

```js
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(caches.match('/'));
    return;
  }
});
```
