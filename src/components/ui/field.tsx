import { cn } from "../../core/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
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
