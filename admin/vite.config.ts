import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // Served at /admin/ alongside the main static site on the same
  // nginx host — asset URLs need this prefix or they'd resolve against
  // the site's own /assets/ (css/js/img) instead of the admin bundle's.
  base: "/admin/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5173 },
});
