/**
 * Inicio de sesión y registro (ruta "/signup").
 */
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { SignInForm } from "../components/auth/SignInForm";
import { SignUpForm } from "../components/auth/SignUpForm";
import { dataSource } from "../core/backend";
import { DEMO_ACCOUNTS } from "../core/backend/local/demo-accounts";
import {
  getAuthErrorMessage,
  signInWithEmail,
  supportsGoogleSignIn,
} from "../core/auth";
import { cn } from "../core/utils";
import { toast } from "sonner";

/** Pestaña activa: iniciar sesión o crear cuenta. */
type Mode = "signin" | "signup";

/**
 * Pantalla de inicio de sesión y registro con dos pestañas.
 *
 * Si alguien llega aquí porque intentó abrir una ruta privada, RequireAuth
 * guarda esa ruta en `location.state.from` y, al ingresar, se le devuelve ahí.
 * En modo local muestra las cuentas de prueba; en modo Firebase, el botón de
 * Google.
 */
export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Después de ingresar se vuelve a la página que el usuario intentaba abrir.
  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
  const onSuccess = () => navigate(redirectTo, { replace: true });

  if (user) return <Navigate to={redirectTo} replace />;

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border bg-white shadow-sm md:grid-cols-2">
      <div className="hidden flex-col justify-center gap-4 bg-gradient-to-br from-neutral-900 to-brand-800 p-12 text-white md:flex">
        <h1 className="font-sofia text-5xl">
          {mode === "signin" ? "¡Hola de nuevo!" : "Bienvenido/a"}
        </h1>
        <p className="text-lg text-brand-100">
          {mode === "signin"
            ? "Ingresa con tus datos para ver el catálogo y realizar compras."
            : "Crea una cuenta para acceder a todo nuestro catálogo y publicar tus propios productos."}
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <div
          role="tablist"
          className="mb-8 grid grid-cols-2 rounded-lg bg-neutral-100 p-1"
        >
          {(
            [
              ["signin", "Iniciar sesión"],
              ["signup", "Crear cuenta"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              type="button"
              aria-selected={mode === value}
              onClick={() => setMode(value)}
              className={cn(
                "rounded-md py-2 font-semibold text-neutral-500 transition",
                mode === value && "bg-white text-neutral-900 shadow-sm",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "signin" ? (
          <SignInForm onSuccess={onSuccess} />
        ) : (
          <SignUpForm onSuccess={onSuccess} />
        )}

        {supportsGoogleSignIn && (
          <>
            <div className="my-6 flex items-center gap-3 text-sm text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />o
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
            <GoogleSignInButton onSuccess={onSuccess} />
          </>
        )}

        {dataSource === "local" && <DemoAccounts onSuccess={onSuccess} />}
      </div>
    </div>
  );
}

/** En modo local muestra cuentas de ejemplo para entrar con un clic. */
function DemoAccounts({ onSuccess }: { onSuccess: () => void }) {
  return (
    <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm">
      <p className="mb-3 font-semibold text-brand-800">
        Modo local: cuentas de prueba
      </p>
      <ul className="space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <li
            key={account.email}
            className="flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <span className="font-mono">{account.email}</span> /{" "}
              <span className="font-mono">{account.password}</span>
              <br />
              <span className="text-neutral-500">{account.description}</span>
            </span>
            <button
              type="button"
              className="shrink-0 rounded-md bg-brand-700 px-3 py-1.5 font-semibold text-white hover:bg-brand-800"
              onClick={async () => {
                try {
                  await signInWithEmail(account.email, account.password);
                  onSuccess();
                } catch (error) {
                  toast.error(getAuthErrorMessage(error));
                }
              }}
            >
              Entrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
