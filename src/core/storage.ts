import { loadBackend } from "./backend";

export { imagePaths } from "./constants";

/** Devuelve la URL de una imagen, o null si no existe. */
export async function getImageUrl(path: string) {
  return (await loadBackend()).getImageUrl(path);
}

/** Sube una imagen y devuelve su URL. */
export async function uploadImage(path: string, file: File) {
  return (await loadBackend()).uploadImage(path, file);
}
