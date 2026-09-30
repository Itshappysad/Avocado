import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../core/utils";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  invalid?: boolean;
};

/** Campo de texto. Si es de tipo "password" muestra un botón para ver la contraseña. */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", invalid, ...props },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      <input
        ref={ref}
        type={isPassword && showPassword ? "text" : type}
        aria-invalid={invalid || undefined}
        className={cn(
          "h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-base outline-none transition placeholder:text-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:cursor-not-allowed disabled:opacity-60",
          invalid &&
            "border-red-500 focus:border-red-500 focus:ring-red-500/30",
          isPassword && "pr-10",
          className,
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-neutral-500 hover:text-neutral-900"
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      )}
    </div>
  );
});

export { Input };
