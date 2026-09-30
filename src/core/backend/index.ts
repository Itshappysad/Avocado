import type { Backend } from "./types";

export type DataSource = "local" | "firebase";

/**
 * Origen de los datos, elegido con VITE_DATA_SOURCE en el archivo .env.
 * Si no se define, la app funciona en modo local (sin internet ni Firebase).
 */
export const dataSource: DataSource =
  import.meta.env.VITE_DATA_SOURCE === "firebase" ? "firebase" : "local";

let backendPromise: Promise<Backend> | null = null;

/**
 * Carga el backend una sola vez. Se usa import() dinámico para que el código
 * de Firebase (~750 kB) solo se descargue cuando de verdad se usa.
 */
export function loadBackend(): Promise<Backend> {
  backendPromise ??=
    dataSource === "firebase"
      ? import("./firebase").then((m) => m.createFirebaseBackend())
      : import("./local").then((m) => m.createLocalBackend());
  return backendPromise;
}
