import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, "popup.html"),
        viewer: path.resolve(__dirname, "viewer.html"),
        // Scripts
        background: path.resolve(__dirname, "src/background/index.ts"),
        content: path.resolve(__dirname, "src/content/index.ts"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") return "background.js";
          if (chunkInfo.name === "content") return "content.js";
          return "assets/[name]-[hash].js";
        },
        assetFileNames: "assets/[name]-[hash].[ext]",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
