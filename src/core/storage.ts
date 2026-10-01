/**
 * Imágenes (productos y fotos de perfil).
 *
 * Fachada sobre el backend activo: en modo local las imágenes se guardan en el
 * navegador; en modo Firebase, en Firebase Storage.
 */
import { loadBackend } from "./backend";

/** Rutas de las imágenes (se reexportan aquí por comodidad). */
export { imagePaths } from "./constants";

/**
 * Devuelve la URL de una imagen para usar en <img src>, o null si no existe.
 *
 * @param path Ruta de la imagen; usa `imagePaths` para construirla.
 */
export async function getImageUrl(path: string) {
  return (await loadBackend()).getImageUrl(path);
}

/**
 * Sube (o reemplaza) una imagen y devuelve su nueva URL.
 *
 * En modo local la imagen se reduce a 800 px y se guarda como JPEG para que
 * quepa en el navegador.
 */
export async function uploadImage(path: string, file: File) {
  return (await loadBackend()).uploadImage(path, file);
}
