import { dataSource, loadBackend } from "./backend";
import { AuthError, type AuthUser } from "./backend/types";

export type { AuthUser };

/** Google solo está disponible cuando se usa Firebase. */
export const supportsGoogleSignIn = dataSource === "firebase";

/** Mensaje legible en español para mostrar cuando falla el inicio de sesión. */
export function getAuthErrorMessage(error: unknown) {
  return error instanceof AuthError
    ? error.message
    : "Ha ocurrido un error inesperado";
}

/** Escucha cuándo se inicia o se cierra sesión. Devuelve la función para dejar de escuchar. */
export function onAuthChange(callback: (user: AuthUser | null) => void) {
  let unsubscribe: (() => void) | undefined;
  let cancelled = false;
  loadBackend().then((backend) => {
    if (!cancelled) unsubscribe = backend.onAuthChange(callback);
  });
  return () => {
    cancelled = true;
    unsubscribe?.();
  };
}

export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}) {
  await (await loadBackend()).signUpWithEmail(input);
}

export async function signInWithEmail(email: string, password: string) {
  await (await loadBackend()).signInWithEmail(email, password);
}

export async function signInWithGoogle() {
  await (await loadBackend()).signInWithGoogle();
}

export async function signOut() {
  await (await loadBackend()).signOut();
}
