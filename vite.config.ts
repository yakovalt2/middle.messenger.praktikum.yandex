import { defineConfig } from "vite";
import path from "path";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: path.resolve(__dirname, "src/components"), // Укажите путь к директории с компонентами
    }),
  ],
  assetsInclude: ["**/*.hbs"], // Чтобы Vite включал .hbs файлы как ассеты
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
