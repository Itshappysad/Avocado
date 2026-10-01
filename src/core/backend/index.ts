/**
 * Selección y carga del backend (origen de los datos).
 *
 * El backend se elige con la variable VITE_DATA_SOURCE del archivo .env:
 * - "local" (o sin definir): datos de ejemplo guardados en el navegador.
 * - "firebase": Firebase Auth + Firestore + Storage.
 */
import type { Backend } from "./types";

/** Orígenes de datos disponibles. */
export type DataSource = "local" | "firebase";

/**
 * Origen de los datos, elegido con VITE_DATA_SOURCE en el archivo .env.
 * Si no se define, la app funciona en modo local (sin internet ni Firebase).
 */
export const dataSource: DataSource =
  import.meta.env.VITE_DATA_SOURCE === "firebase" ? "firebase" : "local";

let backendPromise: Promise<Backend> | null = null;

/**
 * Devuelve el backend activo, creándolo la primera vez que se pide.
 *
 * Se usa import() dinámico para que el código de Firebase (~750 kB) solo se
 * descargue cuando de verdad se usa. Las siguientes llamadas devuelven la
 * misma promesa, así que el backend se crea una sola vez.
 */
export function loadBackend(): Promise<Backend> {
  backendPromise ??=
    dataSource === "firebase"
      ? import("./firebase").then((m) => m.createFirebaseBackend())
      : import("./local").then((m) => m.createLocalBackend());
  return backendPromise;
}
