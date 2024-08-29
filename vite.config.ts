import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  server: { port: 9001, strictPort: true, open: true },
  build: {
    minify: "esbuild", // recheck with terser when the game will grow. For the moment esbuild wins.
    cssMinify: "esbuild", // recheck with lightningcss when the game will grow. For the moment esbuild wins.
  },
  plugins: [viteSingleFile()],
});
