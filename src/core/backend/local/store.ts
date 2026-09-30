/**
 * "Base de datos" local: un objeto JSON guardado en localStorage.
 *
 * Sirve para probar la aplicación completa sin Firebase ni internet.
 * Los datos viven solo en este navegador; "Restablecer datos" los devuelve
 * al estado de ejemplo inicial.
 */
import type {
  CartItem,
  Company,
  CompanyOrder,
  Product,
  User,
  UserPurchase,
} from "../../types";
import { createSeed } from "./seed";

const DB_KEY = "avocado:db:v1";
const SESSION_KEY = "avocado:session";
const IMAGE_PREFIX = "avocado:img:";

/** Las fechas se guardan como texto ISO porque localStorage solo guarda texto. */
type Stored<T extends { orderedAt: Date }> = Omit<T, "orderedAt"> & {
  orderedAt: string;
};

export type StoredUser = User & { passwordHash: string };
export type StoredPurchase = Stored<UserPurchase>;
export type StoredOrder = Stored<CompanyOrder>;

export type LocalDb = {
  users: Record<string, StoredUser>;
  companies: Record<string, Company>;
  products: Record<string, Product>;
  carts: Record<string, Record<string, CartItem>>;
  purchases: Record<string, Record<string, StoredPurchase>>;
  orders: Record<string, Record<string, StoredOrder>>;
};

/* ------------------------------ Lectura/escritura ------------------------------ */

let cache: LocalDb | null = null;
const listeners = new Set<() => void>();

function load(): LocalDb {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as LocalDb;
  } catch {
    // Datos corruptos o localStorage bloqueado: se vuelve a los de ejemplo.
  }
  const seed = createSeed();
  persist(seed);
  return seed;
}

function persist(db: LocalDb) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Sin localStorage (modo privado estricto): los datos duran hasta recargar.
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

/** Devuelve una copia de los datos para que nadie los modifique por accidente. */
export function read(): LocalDb {
  cache ??= load();
  return structuredClone(cache);
}

/** Modifica los datos, los guarda y avisa a quienes estén suscritos. */
export function write(mutate: (db: LocalDb) => void) {
  const db = read();
  mutate(db);
  cache = db;
  persist(db);
  notify();
}

/** Se ejecuta cada vez que cambian los datos o la sesión. */
export function listen(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Si los datos cambian en otra pestaña, esta también se actualiza.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === DB_KEY) cache = null;
    if (event.key === DB_KEY || event.key === SESSION_KEY) notify();
  });
}

/* ---------------------------------- Sesión ---------------------------------- */

export function getSessionUserId() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setSessionUserId(userId: string | null) {
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId);
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignorado: sin localStorage la sesión no se recuerda al recargar.
  }
  notify();
}

/* --------------------------------- Imágenes --------------------------------- */

export function getStoredImage(path: string) {
  try {
    return localStorage.getItem(IMAGE_PREFIX + path);
  } catch {
    return null;
  }
}

export function storeImage(path: string, dataUrl: string) {
  try {
    localStorage.setItem(IMAGE_PREFIX + path, dataUrl);
  } catch {
    throw new Error(
      "No hay espacio en el navegador para guardar la imagen. Prueba con una más pequeña.",
    );
  }
  notify();
}

/* ---------------------------------- Utilidades ---------------------------------- */

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Borra todo lo guardado y vuelve a los datos de ejemplo. */
export function resetLocalData() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("avocado:"))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignorado.
  }
  cache = null;
  notify();
}
