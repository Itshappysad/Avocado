/**
 * Indicadores de carga.
 */
import { Loader2 } from "lucide-react";
import { cn } from "../../core/utils";

/** Ícono de carga girando. */
export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      aria-label="Cargando"
      className={cn("size-6 animate-spin text-neutral-500", className)}
    />
  );
}

/** Indicador de carga centrado para secciones o páginas completas. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn("grid min-h-40 place-items-center py-10", className)}>
      <Spinner className="size-8" />
    </div>
  );
}
