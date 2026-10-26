/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOATCOUNTER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
