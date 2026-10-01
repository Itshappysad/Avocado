/**
 * Funciones de datos que usa la interfaz.
 *
 * No hablan directamente con Firebase: delegan en el backend activo
 * (local o Firebase, ver src/core/backend). Así los componentes no cambian
 * aunque cambie el origen de los datos.
 */
import { loadBackend } from "./backend";
import type { Backend } from "./backend/types";

/** Nombres de los métodos del Backend que devuelven una promesa. */
type AsyncMethod = {
  [K in keyof Backend]: Backend[K] extends (
    ...args: never[]
  ) => Promise<unknown>
    ? K
    : never;
}[keyof Backend];

/**
 * Crea una función con la misma firma que el método `name` del backend, que
 * primero espera a que el backend esté cargado y luego lo llama.
 */
function delegate<K extends AsyncMethod>(name: K) {
  return (async (...args: unknown[]) => {
    const backend = await loadBackend();
    return (backend[name] as (...a: unknown[]) => unknown)(...args);
  }) as Backend[K];
}

/**
 * Igual que `delegate`, pero para suscripciones en tiempo real.
 *
 * Las suscripciones deben devolver su función de "dejar de escuchar" de
 * inmediato (React la necesita en el cleanup de useEffect), aunque el backend
 * todavía esté cargando. Si se cancela antes de que cargue, nunca se suscribe.
 */
function subscription<A extends unknown[]>(
  start: (backend: Backend, ...args: A) => () => void,
) {
  return (...args: A) => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    loadBackend().then((backend) => {
      if (!cancelled) unsubscribe = start(backend, ...args);
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  };
}

/* -------------------------- Usuarios -------------------------------- */
/** Perfil de un usuario por id, o null si no existe. */
export const getUser = delegate("getUser");

/** Actualiza nombre, dirección y código postal de un usuario. */
export const updateUser = delegate("updateUser");

/**
 * Escucha el perfil de un usuario en tiempo real.
 * @returns Función para dejar de escuchar.
 */
export const subscribeToUser = subscription(
  (b, id: string, onChange: Parameters<Backend["subscribeToUser"]>[1]) =>
    b.subscribeToUser(id, onChange),
);

/* -------------------------- Empresas -------------------------------- */
/** Empresa cuyo dueño es el usuario indicado, o null si no tiene. */
export const getCompanyByOwner = delegate("getCompanyByOwner");

/**
 * Registra la empresa de un usuario y devuelve su id.
 * @throws Error si el usuario ya tiene una empresa.
 */
export const createCompany = delegate("createCompany");

/** Modifica los datos de una empresa. */
export const updateCompany = delegate("updateCompany");

/* -------------------------- Productos ------------------------------- */
/** Todos los productos de la tienda. */
export const getProducts = delegate("getProducts");

/** Productos que pertenecen a una categoría (ej: "Camisa"). */
export const getProductsByCategory = delegate("getProductsByCategory");

/** Productos de un material (ej: "seda"). */
export const getProductsByMaterial = delegate("getProductsByMaterial");

/** Un producto por id, o null si fue eliminado. */
export const getProductById = delegate("getProductById");

/** Productos publicados por una empresa. */
export const getCompanyProducts = delegate("getCompanyProducts");

/** Publica un producto nuevo con su imagen y devuelve su id. */
export const createProduct = delegate("createProduct");

/** Modifica un producto; la imagen solo se reemplaza si se envía una nueva. */
export const updateProduct = delegate("updateProduct");

/* -------------------------- Carrito --------------------------------- */
/**
 * Escucha el carrito de un usuario en tiempo real.
 * @returns Función para dejar de escuchar.
 */
export const subscribeToCart = subscription(
  (b, userId: string, onChange: Parameters<Backend["subscribeToCart"]>[1]) =>
    b.subscribeToCart(userId, onChange),
);

/** Agrega una línea nueva al carrito con cantidad 1. */
export const addToCart = delegate("addToCart");

/** Cambia la cantidad de una línea; si llega a 0 la elimina. */
export const setCartItemQuantity = delegate("setCartItemQuantity");

/** Elimina una línea del carrito. */
export const removeFromCart = delegate("removeFromCart");

/* -------------------------- Compras y pedidos ----------------------- */
/**
 * Convierte el carrito en compras/pedidos (uno por empresa) y lo vacía.
 * @throws Error si el carrito está vacío o algún producto ya no existe.
 */
export const purchase = delegate("purchase");

/** Historial de compras de un cliente, de la más reciente a la más antigua. */
export const getPurchaseHistory = delegate("getPurchaseHistory");

/** Pedidos recibidos por una empresa, del más reciente al más antiguo. */
export const getCompanyOrders = delegate("getCompanyOrders");

/** Cambia el estado de un pedido y de la compra enlazada del cliente. */
export const updateOrderState = delegate("updateOrderState");
