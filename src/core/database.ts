/**
 * Funciones de datos que usa la interfaz.
 *
 * No hablan directamente con Firebase: delegan en el backend activo
 * (local o Firebase, ver src/core/backend). Así los componentes no cambian
 * aunque cambie el origen de los datos.
 */
import { loadBackend } from "./backend";
import type { Backend } from "./backend/types";

type AsyncMethod = {
  [K in keyof Backend]: Backend[K] extends (
    ...args: never[]
  ) => Promise<unknown>
    ? K
    : never;
}[keyof Backend];

/** Crea una función que espera al backend y llama a su método. */
function delegate<K extends AsyncMethod>(name: K) {
  return (async (...args: unknown[]) => {
    const backend = await loadBackend();
    return (backend[name] as (...a: unknown[]) => unknown)(...args);
  }) as Backend[K];
}

/** Igual que delegate, pero para suscripciones en tiempo real. */
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

/* Usuarios */
export const getUser = delegate("getUser");
export const updateUser = delegate("updateUser");
export const subscribeToUser = subscription(
  (b, id: string, onChange: Parameters<Backend["subscribeToUser"]>[1]) =>
    b.subscribeToUser(id, onChange),
);

/* Empresas */
export const getCompanyByOwner = delegate("getCompanyByOwner");
export const createCompany = delegate("createCompany");
export const updateCompany = delegate("updateCompany");

/* Productos */
export const getProducts = delegate("getProducts");
export const getProductsByCategory = delegate("getProductsByCategory");
export const getProductsByMaterial = delegate("getProductsByMaterial");
export const getProductById = delegate("getProductById");
export const getCompanyProducts = delegate("getCompanyProducts");
export const createProduct = delegate("createProduct");
export const updateProduct = delegate("updateProduct");

/* Carrito */
export const subscribeToCart = subscription(
  (b, userId: string, onChange: Parameters<Backend["subscribeToCart"]>[1]) =>
    b.subscribeToCart(userId, onChange),
);
export const addToCart = delegate("addToCart");
export const setCartItemQuantity = delegate("setCartItemQuantity");
export const removeFromCart = delegate("removeFromCart");

/* Compras y pedidos */
export const purchase = delegate("purchase");
export const getPurchaseHistory = delegate("getPurchaseHistory");
export const getCompanyOrders = delegate("getCompanyOrders");
export const updateOrderState = delegate("updateOrderState");
