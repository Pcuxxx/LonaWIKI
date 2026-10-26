import { useEffect } from "react";
import { OG_IMAGE, PAGE_BY_ID, SITE_BASE, SITE_ORIGIN } from "./pages";
import type { Route } from "./router";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function canonicalFor(section: Route["section"]): string {
  const page = PAGE_BY_ID[section] ?? PAGE_BY_ID.home;
  return `${SITE_ORIGIN}${SITE_BASE.replace(/\/$/, "")}/${page.path}`.replace(/\/+$/, "/");
}

export function usePageMeta(route: Route) {
  useEffect(() => {
    const page = PAGE_BY_ID[route.section] ?? PAGE_BY_ID.home;
    const canonical = canonicalFor(page.id);

    document.title = page.title;
    document.documentElement.dataset.section = page.id;

    upsertMeta('meta[name="description"]', { name: "description", content: page.description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: page.noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large",
    });

    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "LonaRPG: Архив Ноэра" });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "ru_RU" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: page.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: OG_IMAGE });
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: page.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: page.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: OG_IMAGE });

    upsertLink("canonical", canonical);
  }, [route.section]);
}
