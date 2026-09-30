import type {
  CartItem,
  CompanyOrder,
  OrderState,
  User,
  UserPurchase,
} from "../../types";
import { imagePaths } from "../../constants";
import { AuthError, type AuthUser, type Backend } from "../types";
import { hashPassword, verifyPassword } from "./password";
import { SEED_IMAGES } from "./seed";
import {
  getSessionUserId,
  getStoredImage,
  listen,
  newId,
  read,
  setSessionUserId,
  storeImage,
  write,
  type StoredUser,
} from "./store";

/** Pequeña espera para que la app se comporte como con una base de datos real. */
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

const toUser = ({ passwordHash: _hash, ...user }: StoredUser): User => user;

const toAuthUser = (user: StoredUser): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const withDate = <T extends { orderedAt: string }>(item: T) => ({
  ...item,
  orderedAt: new Date(item.orderedAt),
});

const byNewest = (a: { orderedAt: Date }, b: { orderedAt: Date }) =>
  b.orderedAt.getTime() - a.orderedAt.getTime();

/**
 * Se suscribe a los datos y solo avisa cuando el valor calculado cambia
 * (así no se vuelve a renderizar la app por cambios que no le afectan).
 */
function watch<T>(select: () => T, onChange: (value: T) => void) {
  let last: string | undefined;
  const check = () => {
    const value = select();
    const serialized = JSON.stringify(value);
    if (serialized === last) return;
    last = serialized;
    onChange(value);
  };
  queueMicrotask(check);
  return listen(check);
}

/** Convierte y reduce una imagen a JPEG para que quepa en localStorage. */
async function fileToDataUrl(file: File, maxSize = 800) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return Object.values(read().users).find(
    (u) => u.email.toLowerCase() === normalized,
  );
}

export function createLocalBackend(): Backend {
  const getProductById = async (id: string) => read().products[id] ?? null;
  const allProducts = () => Object.values(read().products);

  const getImageUrl = async (path: string) =>
    getStoredImage(path) ?? SEED_IMAGES[path] ?? null;

  const uploadImage = async (path: string, file: File) => {
    const dataUrl = await fileToDataUrl(file);
    storeImage(path, dataUrl);
    return dataUrl;
  };

  return {
    /* ------------------------------ Autenticación ------------------------------ */

    onAuthChange: (callback) =>
      watch(() => {
        const id = getSessionUserId();
        const user = id ? read().users[id] : undefined;
        return user ? toAuthUser(user) : null;
      }, callback),

    signUpWithEmail: async ({ name, email, password }) => {
      await delay();
      if (findUserByEmail(email)) {
        throw new AuthError("Ya existe una cuenta con ese correo");
      }
      const id = newId("u");
      write((db) => {
        db.users[id] = {
          id,
          name,
          email: email.trim(),
          provider: "local",
          passwordHash: hashPassword(password),
        };
      });
      setSessionUserId(id);
    },

    signInWithEmail: async (email, password) => {
      await delay();
      const user = findUserByEmail(email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        throw new AuthError("Correo o contraseña incorrectos");
      }
      setSessionUserId(user.id);
    },

    signInWithGoogle: async () => {
      throw new AuthError("Google solo está disponible con Firebase");
    },

    signOut: async () => setSessionUserId(null),

    /* --------------------------------- Usuarios --------------------------------- */

    getUser: async (id) => {
      const user = read().users[id];
      return user ? toUser(user) : null;
    },

    subscribeToUser: (id, onChange) =>
      watch(
        () => read().users[id],
        (user) => user && onChange(toUser(user)),
      ),

    updateUser: async (id, data) => {
      await delay();
      write((db) => {
        Object.assign(db.users[id], data);
      });
    },

    /* --------------------------------- Empresas --------------------------------- */

    getCompanyByOwner: async (userId) =>
      Object.values(read().companies).find((c) => c.userId === userId) ?? null,

    createCompany: async (userId, data) => {
      await delay();
      if (Object.values(read().companies).some((c) => c.userId === userId)) {
        throw new Error("Ya tienes una empresa registrada");
      }
      const id = newId("c");
      write((db) => {
        db.companies[id] = { id, userId, ...data };
      });
      return id;
    },

    updateCompany: async (companyId, data) => {
      await delay();
      write((db) => {
        Object.assign(db.companies[companyId], data);
      });
    },

    /* --------------------------------- Productos -------------------------------- */

    getProducts: async () => allProducts(),
    getProductsByCategory: async (category) =>
      allProducts().filter((p) => p.categories.includes(category)),
    getProductsByMaterial: async (material) =>
      allProducts().filter((p) => p.materials === material),
    getProductById,
    getCompanyProducts: async (companyId) =>
      allProducts().filter((p) => p.companyId === companyId),

    createProduct: async (companyId, data, image) => {
      const id = newId("p");
      await uploadImage(imagePaths.product(id), image);
      write((db) => {
        db.products[id] = { id, companyId, ...data };
      });
      return id;
    },

    updateProduct: async (productId, data, image) => {
      if (image) await uploadImage(imagePaths.product(productId), image);
      write((db) => {
        Object.assign(db.products[productId], data);
      });
    },

    /* ---------------------------------- Carrito --------------------------------- */

    subscribeToCart: (userId, onChange) =>
      watch(() => Object.values(read().carts[userId] ?? {}), onChange),

    addToCart: async (userId, item) => {
      const id = newId("ci");
      write((db) => {
        (db.carts[userId] ??= {})[id] = { ...item, id, quantity: 1 };
      });
    },

    setCartItemQuantity: async (userId, cartItemId, quantity) => {
      write((db) => {
        const cart = db.carts[userId] ?? {};
        if (quantity <= 0) delete cart[cartItemId];
        else if (cart[cartItemId]) cart[cartItemId].quantity = quantity;
      });
    },

    removeFromCart: async (userId, cartItemId) => {
      write((db) => {
        delete db.carts[userId]?.[cartItemId];
      });
    },

    /* ----------------------------- Compras y pedidos ---------------------------- */

    purchase: async ({ userId, items, address }) => {
      await delay(400);
      if (items.length === 0) throw new Error("El carrito está vacío");

      // Un pedido por empresa, cada uno solo con los productos de esa empresa.
      const db = read();
      const itemsByCompany = new Map<string, CartItem[]>();
      for (const item of items) {
        const product = db.products[item.productId];
        if (!product) {
          throw new Error("Uno de los productos del carrito ya no existe");
        }
        const list = itemsByCompany.get(product.companyId) ?? [];
        list.push(item);
        itemsByCompany.set(product.companyId, list);
      }

      const orderedAt = new Date().toISOString();
      write((db) => {
        for (const [companyId, companyItems] of itemsByCompany) {
          const orderId = newId("o");
          const purchaseId = newId("pu");
          const common = {
            items: companyItems,
            address,
            state: "pendiente" as OrderState,
            orderedAt,
          };
          (db.orders[companyId] ??= {})[orderId] = {
            id: orderId,
            userId,
            purchaseId,
            ...common,
          };
          (db.purchases[userId] ??= {})[purchaseId] = {
            id: purchaseId,
            companyId,
            orderId,
            ...common,
          };
        }
        for (const item of items) delete db.carts[userId]?.[item.id];
      });
    },

    getPurchaseHistory: async (userId) =>
      Object.values(read().purchases[userId] ?? {})
        .map((p) => withDate(p) as UserPurchase)
        .sort(byNewest),

    getCompanyOrders: async (companyId) =>
      Object.values(read().orders[companyId] ?? {})
        .map((o) => withDate(o) as CompanyOrder)
        .sort(byNewest),

    updateOrderState: async ({ companyId, order, state }) => {
      await delay();
      write((db) => {
        const stored = db.orders[companyId]?.[order.id];
        if (stored) stored.state = state;
        const purchase =
          order.purchaseId && db.purchases[order.userId]?.[order.purchaseId];
        if (purchase) purchase.state = state;
      });
    },

    /* --------------------------------- Imágenes --------------------------------- */

    getImageUrl,
    uploadImage,
  };
}
