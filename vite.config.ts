import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
  build: {
    minify: "esbuild", // Default. Fast, good compression. "terser" - sometimes slightly smaller, slower build
  },
});
