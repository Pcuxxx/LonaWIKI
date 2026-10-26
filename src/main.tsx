import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { href, parseHash } from "./lib/router";
import { initAnalytics } from "./lib/analytics";
import { registerServiceWorker } from "./lib/pwa";

// Старые ссылки #/items/id → /items#id. Делаем до рендера, чтобы не мигал hash-маршрут.
if (window.location.hash.startsWith("#/")) {
  const route = parseHash(window.location.hash);
  window.history.replaceState({ section: route.section, id: route.id }, "", href(route.section, route.id));
}

initAnalytics();
registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
