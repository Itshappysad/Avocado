import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // En modo Firebase su SDK ocupa ~750 kB por sí solo; es normal.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // React en un archivo propio para que el navegador lo guarde en caché.
        // Firebase ya se separa solo porque se carga con import() dinámico.
        manualChunks: { react: ["react", "react-dom", "react-router-dom"] },
      },
    },
  },
});
