# SHAKH Progressive Web App

## PWA v1 scope

SHAKH is installable as a Progressive Web App on browsers and operating systems that support web-app installation. The v1 implementation includes:

- App Router Web App Manifest at `/manifest.webmanifest`.
- Static 192x192 and 512x512 PNG app icons stored under `public/icons/`.
- Standalone display mode, Sorani language and RTL direction, SHAKH theme colors, app shortcuts, and Apple web-app metadata.
- Production service-worker registration at `/sw.js`.
- A custom offline fallback page at `/offline`.
- A browser-provided installation prompt where `beforeinstallprompt` is supported.
- A small online/offline connection notice.

## Cache and security policy

The service worker is deliberately conservative:

- It may cache only Next.js hashed static assets and SHAKH PWA icon responses.
- Document navigations are network-first. When the network is unavailable, the worker serves the generic offline page.
- It does not cache HTML pages, Supabase responses, API requests, Auth callbacks, profile data, workspace pages, wallet information, order information, or personal data.
- It never queues or replays POST/PUT/PATCH/DELETE requests.

This means v1 provides installability and a safe offline fallback, not offline commerce. Sign-in, profile changes, checkout, order placement, wallet movements, and delivery actions require a live network connection.

## Notifications

Web Push is not included in PWA v1. It requires a consent-based subscription flow, VAPID keys, a server-side subscription store, delivery/retry handling, and notification preferences. It will be implemented with the notification milestone in the product roadmap, not by exposing secrets in the browser.

## Device installation

- Chrome, Edge, and supported Chromium browsers can show the in-app install action when the browser fires `beforeinstallprompt`.
- On iPhone and iPad, installation is performed from the browser's Share menu using **Add to Home Screen**; the custom Chromium install prompt is not used there.
- Installation behavior and promotion vary by browser and operating system.

## Release verification checklist

1. Open `/manifest.webmanifest` and verify that it returns valid JSON.
2. Open `/icons/icon-192.png` and `/icons/icon-512.png`; confirm that each returns a PNG response with the specified dimensions.
3. In a production build over HTTPS, verify that `/sw.js` is registered and controls the app.
4. Install on a supported Chromium browser and confirm the standalone launch and app icon.
5. Load the public homepage, disconnect the network, then navigate to another page and confirm the generic offline fallback appears.
6. Confirm that no authenticated page, response payload, or user-specific data is available from Cache Storage.
7. Test sign-in, email confirmation, sign-out, and profile update while online after installation.
8. Run Lighthouse PWA and accessibility checks, then test on Android Chrome and iOS Safari.

A successful build does not replace device-level install and offline testing.

## Icon implementation note

PWA icons are static PNG assets. This avoids runtime image rendering and keeps icon requests independent of application server rendering.
