/* Paper Trail service worker — bump CACHE on every engine release.
   v4 cutover: new module-based shell. skipWaiting + clients.claim + old-cache purge below make the
   new app take over promptly; the page reloads once on controllerchange. Engine/content modules
   not precached here are runtime-cached (cache-first) on first online load, so offline works after
   one visit; the CACHE bump on each release discards the old ones. */
const CACHE = "papertrail-v4.7.0";
const ASSETS = ["./","./index.html","./app.js","./manifest.webmanifest","./spec/concepts.json",
  "./spec/syllabus-outcomes.json",
  "./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit =>
      hit || fetch(e.request).then(res => {
        const copy = res.clone();
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => e.request.mode === "navigate" ? caches.match("./index.html") : undefined)
    )
  );
});
