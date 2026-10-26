/* LonaRPG: Архив Ноэра — service worker.
 *
 * Стратегии:
 *   • навигация   — сеть, при офлайне отдаём сохранённый index.html;
 *   • статика     — stale-while-revalidate (мгновенно из кэша, обновление в фоне);
 *   • остальное   — обычный запрос, кэш не трогаем.
 *
 * __BUILD__ заменяется на хеш сборки в scripts/postbuild.mjs. При новой
 * сборке кэш получает новое имя, старый удаляется на activate.
 */

const BUILD = "__BUILD__";
const VERSION = `lonawiki-${BUILD}`;
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;

const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      // Один недоступный файл не должен ломать установку целиком.
      await Promise.all(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => undefined),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.disable();
      }
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone()).catch(() => undefined);
    return response;
  } catch {
    const cached =
      (await cache.match(request, { ignoreSearch: true })) ||
      (await cache.match("./index.html")) ||
      (await cache.match("./"));
    if (cached) return cached;
    return new Response(
      `<!doctype html><html lang="ru"><meta charset="utf-8"><title>Нет сети</title><body style="background:#07060a;color:#ece4d4;font-family:Georgia,serif;padding:40px"><h1>Нет сети</h1><p>Архив не загружен, а сохранённой копии нет. Откройте сайт один раз с интернетом — дальше карта и разделы будут работать офлайн.</p></body></html>`,
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok && response.type === "basic") {
        cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    })
    .catch(() => undefined);
  return cached || (await network) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (/\.(?:js|css|woff2?|png|svg|jpg|jpeg|webp|avif|ico|json|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
