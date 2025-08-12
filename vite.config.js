import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "draggable",
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: true,
    minify: "esbuild",
    emptyOutDir: true,
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
