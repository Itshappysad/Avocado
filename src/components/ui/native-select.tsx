/**
 * Lista desplegable (<select> nativo) con el estilo de la app.
 */
import { forwardRef } from "react";
import { cn } from "../../core/utils";

type NativeSelectProps = React.ComponentPropsWithoutRef<"select"> & {
  /** Resalta el borde en rojo. */
  invalid?: boolean;
};

/** <select> nativo con el mismo estilo que Input. */
const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ className, invalid, ...props }, ref) {
    return (
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30",
          invalid && "border-red-500",
          className,
        )}
        {...props}
      />
    );
  },
);

export { NativeSelect };
