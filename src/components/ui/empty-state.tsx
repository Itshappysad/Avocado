/**
 * Mensaje para secciones sin datos (o con error).
 */
import { cn } from "../../core/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Ícono grande arriba del título. */
  icon?: React.ReactNode;
  /** Botón o enlace opcional, ej: "Ir a la tienda". */
  action?: React.ReactNode;
  className?: string;
};

/** Mensaje amigable cuando no hay datos que mostrar (o hubo un error). */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-neutral-400">{icon}</div>}
      <p className="text-lg font-semibold">{title}</p>
      {description && (
        <p className="max-w-md text-sm text-neutral-500">{description}</p>
      )}
      {action}
    </div>
  );
}
