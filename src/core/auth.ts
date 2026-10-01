/**
 * Autenticación (registro, inicio y cierre de sesión).
 *
 * Es una "fachada": la interfaz llama a estas funciones y ellas delegan en el
 * backend activo (local o Firebase). Así ningún componente depende de Firebase.
 */
import { dataSource, loadBackend } from "./backend";
import { AuthError, type AuthUser } from "./backend/types";

export type { AuthUser };

/** Google solo está disponible cuando se usa Firebase. */
export const supportsGoogleSignIn = dataSource === "firebase";

/**
 * Convierte un error de autenticación en un mensaje en español listo para
 * mostrar al usuario (ej: "Correo o contraseña incorrectos").
 */
export function getAuthErrorMessage(error: unknown) {
  return error instanceof AuthError
    ? error.message
    : "Ha ocurrido un error inesperado";
}

/**
 * Escucha cuándo se inicia o se cierra sesión.
 *
 * El callback se llama una vez al principio (con la sesión guardada o null)
 * y luego cada vez que cambia.
 *
 * @returns Función para dejar de escuchar.
 */
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

/**
 * Crea una cuenta con correo y contraseña e inicia sesión con ella.
 *
 * @throws AuthError si el correo ya está registrado o la contraseña es débil.
 */
export async function signUpWithEmail(input: {
  name: string;
  email: string;
  password: string;
}) {
  await (await loadBackend()).signUpWithEmail(input);
}

/**
 * Inicia sesión con correo y contraseña.
 *
 * @throws AuthError si las credenciales son incorrectas.
 */
export async function signInWithEmail(email: string, password: string) {
  await (await loadBackend()).signInWithEmail(email, password);
}

/**
 * Inicia sesión con una ventana emergente de Google (solo modo Firebase).
 * Si es la primera vez, también crea el perfil del usuario.
 */
export async function signInWithGoogle() {
  await (await loadBackend()).signInWithGoogle();
}

/** Cierra la sesión actual. */
export async function signOut() {
  await (await loadBackend()).signOut();
}
