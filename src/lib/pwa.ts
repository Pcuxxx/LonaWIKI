export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    const base = import.meta.env.BASE_URL || "/";
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .then((registration) => registration.update())
      .catch(() => {
        /* офлайн-режим не критичен для работы сайта */
      });
  });
}
