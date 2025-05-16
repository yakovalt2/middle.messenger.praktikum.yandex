import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import path from "path";

import NodeGlobalsPolyfillPlugin from "@esbuild-plugins/node-globals-polyfill";
import NodeModulesPolyfillPlugin from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"),
    }),
  ],
  assetsInclude: ["**/*.hbs"],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin(), NodeModulesPolyfillPlugin()],
    },
  },
  define: {
    global: "globalThis",
    "process.env": {},
  },
});
