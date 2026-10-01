/**
 * Layout principal de la aplicación.
 *
 * Es el elemento raíz del router: dibuja la barra de navegación, el contenido
 * de la página actual (<Outlet />), el pie de página y el panel del carrito.
 * Aquí se monta CartProvider porque necesita el router (para redirigir) y la
 * sesión (AuthProvider, que está más arriba en main.tsx).
 */
import { Outlet, ScrollRestoration } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { CartSheet } from "./components/CartSheet";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";

/** Layout principal: barra de navegación, contenido de la página y pie. */
export default function App() {
  return (
    <CartProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="container flex-1 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartSheet />
      <ScrollRestoration />
    </CartProvider>
  );
}
