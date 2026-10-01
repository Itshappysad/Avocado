/**
 * Pie de página.
 */
import { Link } from "react-router-dom";
import { dataSource } from "../../core/backend";

const INSTAGRAM_URL = "https://www.instagram.com/avocadoevestiti/";

/** Pie de página con enlaces de contacto e información. */
export function Footer() {
  return (
    <footer className="mt-20 border-t bg-neutral-50">
      <div className="container grid gap-8 py-10 text-center sm:grid-cols-3 sm:text-left">
        <div>
          <h2 className="mb-2 font-bold">Contacto</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 hover:text-neutral-900"
          >
            Instagram
          </a>
        </div>
        <div>
          <h2 className="mb-2 font-bold">Información</h2>
          <Link to="/about" className="text-neutral-600 hover:text-neutral-900">
            Sobre nosotros
          </Link>
        </div>
        <div>
          <h2 className="mb-2 font-bold">Soporte</h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 hover:text-neutral-900"
          >
            Servicio al cliente
          </a>
        </div>
      </div>
      <p className="border-t py-4 text-center text-sm italic text-neutral-500">
        © {new Date().getFullYear()} Avocado e Vestiti
      </p>
      {dataSource === "local" && <LocalModeNotice />}
    </footer>
  );
}

/** Aviso de que los datos son de ejemplo y viven solo en este navegador. */
function LocalModeNotice() {
  return (
    <p className="bg-brand-50 px-4 py-2 text-center text-xs text-brand-800">
      Modo local: los datos son de ejemplo y se guardan solo en este navegador.{" "}
      <button
        type="button"
        className="font-semibold underline underline-offset-2"
        onClick={async () => {
          if (
            !window.confirm(
              "¿Borrar tus cambios y volver a los datos de ejemplo?",
            )
          )
            return;
          const { resetLocalData } =
            await import("../../core/backend/local/store");
          resetLocalData();
          window.location.assign("/");
        }}
      >
        Restablecer datos de ejemplo
      </button>
    </p>
  );
}
