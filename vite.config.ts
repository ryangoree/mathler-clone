/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  base: process.env.VITE_BASE_PATH ?? "/",
  test: {
    environment: "jsdom",
    coverage: {
      include: ["src/**/*"],
    },
  },
});
