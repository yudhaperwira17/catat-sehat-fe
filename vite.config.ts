import vue from "@vitejs/plugin-vue";
import VueJSX from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import c from 'unplugin-icons/resolver';
import Icons from "unplugin-icons/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";
import VueDevtools from "vite-plugin-vue-devtools";
import { default as VueLayouts } from "vite-plugin-vue-layouts";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Pages({
      extensions: ["vue"],
    }),
    VueDevtools(),
    VueLayouts(),
    VueJSX(),
    Components({
      directoryAsNamespace: true,
      resolvers: [NaiveUiResolver(), c()],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
