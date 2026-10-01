/**
 * Hash sencillo para NO guardar contraseñas en texto plano en el navegador.
 *
 * Es solo para el modo local de demostración: no es criptográficamente
 * seguro. En producción las contraseñas las maneja Firebase Auth.
 */
/** Función hash rápida de 53 bits (cyrb53, dominio público). */
function cyrb53(text: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < text.length; i++) {
    const ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

/**
 * Calcula el hash de una contraseña.
 *
 * @param salt Texto aleatorio que se mezcla con la contraseña para que dos
 *   contraseñas iguales no den el mismo hash. Si no se pasa, se genera uno.
 * @returns Texto "salt:hash" para guardar.
 */
export function hashPassword(
  password: string,
  salt = Math.random().toString(36).slice(2, 10),
) {
  // Varias rondas para que no sea trivial de revertir.
  let hash = password;
  for (let i = 0; i < 1000; i++) hash = cyrb53(salt + hash, i);
  return `${salt}:${hash}`;
}

/** Indica si `password` corresponde al hash guardado ("salt:hash"). */
export function verifyPassword(password: string, stored: string) {
  const [salt] = stored.split(":");
  return hashPassword(password, salt) === stored;
}
