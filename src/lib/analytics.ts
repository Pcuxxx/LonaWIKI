/**
 * Лёгкая аналитика без cookie: GoatCounter.
 * Включается только если при сборке задан VITE_GOATCOUNTER (код сайта, например "lonawiki").
 * Документация: https://www.goatcounter.com/help/start
 */

declare global {
  interface Window {
    goatcounter?: {
      count?: (vars: { path: string; title?: string; event?: boolean }) => void;
      no_onload?: boolean;
    };
  }
}

let enabled = false;
let initialPage = true;

export function initAnalytics() {
  const code = import.meta.env.VITE_GOATCOUNTER as string | undefined;
  if (!code || import.meta.env.DEV || typeof document === "undefined") return;
  if (document.querySelector("script[data-goatcounter]")) return;

  window.goatcounter = window.goatcounter || {};
  window.goatcounter.no_onload = true;

  const script = document.createElement("script");
  script.async = true;
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  script.src = "https://gc.zgo.at/count.js";
  script.addEventListener("load", () => {
    window.goatcounter?.count?.({
      path: `${location.pathname}${location.hash}`,
      title: document.title,
    });
    initialPage = false;
    enabled = true;
  });
  document.head.appendChild(script);
}

/** Просмотр страницы при клиентской навигации. */
export function trackPage(path: string, title: string) {
  if (!enabled || initialPage) return;
  window.goatcounter?.count?.({ path, title });
}

/** Событие: поиск, фильтр, экспорт, открытие карты и т. п. */
export function trackEvent(name: string, detail?: string | number) {
  if (!enabled) return;
  window.goatcounter?.count?.({
    path: detail === undefined ? `event/${name}` : `event/${name}/${detail}`,
    title: detail === undefined ? name : `${name}: ${detail}`,
    event: true,
  });
}
