import { defineConfig } from "vite";
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/quill-emoji.js'),
      name: 'QuillEmoji',
       formats: ["es", "umd"],
       fileName: (format) => `quill-emoji.${format}.js`,      

    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});


