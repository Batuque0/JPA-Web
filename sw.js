// ─────────────────────────────────────────────────────────────────────
// Remitos JPA · Service Worker
// IMPORTANTE: cada vez que modifiques CUALQUIER archivo de la app
// (index.html, vendor/*, logo, manifest) subí el número de VERSION.
// Así los celulares detectan la versión nueva y ofrecen actualizar.
// ─────────────────────────────────────────────────────────────────────
const VERSION = "3";
const CACHE = "remitos-jpa-v" + VERSION;

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./logo_jpa.png",
  "./vendor/pdf.min.js",
  "./vendor/pdf.worker.min.js",
  "./vendor/jspdf.umd.min.js"
];

// Instalación: descarga TODO (saltando la caché HTTP de GitHub Pages).
// Si algún archivo falla, la instalación se cancela y se reintenta luego,
// por lo que nunca queda una versión a medias.
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(ARCHIVOS.map(u => new Request(u, { cache: "reload" })))
    )
  );
  // Sin skipWaiting automático: la versión nueva espera a que el usuario toque "Actualizar".
});

// Activación: borra versiones viejas y toma el control.
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith("remitos-jpa-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// El usuario aceptó actualizar desde la app.
self.addEventListener("message", e => {
  if (!e.data) return;
  if (e.data.type === "SKIP_WAITING") self.skipWaiting();
  // La app pregunta qué versión está corriendo (se muestra en la pantalla de inicio)
  if (e.data.type === "GET_VERSION" && e.ports && e.ports[0]) e.ports[0].postMessage(VERSION);
});

// Caché primero (todo es local y versionado); red solo si algo no está guardado.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const hit = await caches.match(req, { cacheName: CACHE, ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") {
      const index = await caches.match("./index.html", { cacheName: CACHE });
      if (index) return index;
    }
    return fetch(req);
  })());
});
