/**
 * Punto de entrada de la aplicación.
 *
 * Monta React en el <div id="root"> de index.html y envuelve la app con los
 * proveedores globales, en este orden:
 * 1. QueryClientProvider (TanStack Query): caché de las consultas de datos.
 * 2. AuthProvider: sesión del usuario.
 * 3. RouterProvider: las rutas definidas en router.tsx.
 * Además agrega el <Toaster> que muestra las notificaciones.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./router";
// Fuentes incluidas en el proyecto (no dependen de Google Fonts ni de internet).
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/600.css";
import "@fontsource/karla/700.css";
import "@fontsource/sofia/400.css";
import "./index.css";

/**
 * Caché de datos compartida. Los datos se consideran frescos durante 1 minuto
 * y no se vuelven a pedir al cambiar de pestaña del navegador.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
