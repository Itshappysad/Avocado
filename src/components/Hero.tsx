/**
 * Portada de la página de inicio.
 */
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

/** Portada verde con el logo, un eslogan y el botón para ir a la tienda. */
export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-neutral-900 px-8 py-16 text-white sm:px-14 sm:py-24">
      <div className="relative z-10 max-w-xl space-y-6">
        <p className="font-semibold uppercase tracking-widest text-brand-200">
          Nueva colección
        </p>
        <h1 className="font-sofia text-5xl leading-tight sm:text-6xl">
          Moda que se siente bien
        </h1>
        <p className="text-lg text-brand-100">
          Prendas de marcas locales, elegidas por talla, color y material.
          Compra en pocos clics.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-neutral-900 hover:bg-brand-100"
        >
          <Link to="/store">Cómpralo aquí</Link>
        </Button>
      </div>
      <img
        src="/imgs/AeVlogo.jpeg"
        alt=""
        className="absolute -right-16 top-1/2 hidden size-96 -translate-y-1/2 rounded-full object-cover opacity-30 md:block"
      />
    </section>
  );
}
