/**
 * Contenedor de un campo de formulario: etiqueta, control y mensaje.
 */
import { cn } from "../../core/utils";

type FieldProps = {
  label: string;
  /** Id del control, para que al hacer clic en la etiqueta se enfoque. */
  htmlFor?: string;
  /** Mensaje de error (tiene prioridad sobre `hint`). */
  error?: string;
  /** Texto de ayuda gris debajo del control. */
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

/** Etiqueta + control + mensaje de ayuda o de error. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 text-left", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
}
