import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig({
  plugins: [react(),EnvironmentPlugin(['VITE_KHALTI_PUBLIC_KEY'])
],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
