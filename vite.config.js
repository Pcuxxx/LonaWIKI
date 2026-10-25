import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// На GitHub Pages репозиторий публикуется по адресу /LonaWIKI/.
// Локально и в предпросмотре оставляем корень, чтобы не ломать dev-сервер.
const base = process.env.GITHUB_ACTIONS ? "/LonaWIKI/" : "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
