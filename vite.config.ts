import { defineConfig } from "vite";
import path from "path";
import handlebars from "vite-plugin-handlebars";

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
});
