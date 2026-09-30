import { FirebaseError, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type DocumentSnapshot,
  type QuerySnapshot,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type {
  CartItem,
  Company,
  CompanyOrder,
  OrderState,
  Product,
  User,
  UserPurchase,
} from "../../types";
import { imagePaths } from "../../constants";
import { AuthError, type Backend } from "../types";

const AUTH_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo",
  "auth/invalid-credential": "Correo o contraseña incorrectos",
  "auth/invalid-email": "El correo no es válido",
  "auth/user-not-found": "Correo o contraseña incorrectos",
  "auth/wrong-password": "Correo o contraseña incorrectos",
  "auth/weak-password": "La contraseña es muy débil",
  "auth/too-many-requests": "Demasiados intentos, intenta más tarde",
  "auth/popup-closed-by-user": "Se cerró la ventana de Google",
  "auth/network-request-failed": "Error de conexión, revisa tu internet",
};

/** Traduce los errores de Firebase Auth a un AuthError con mensaje en español. */
async function withAuthErrors(action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new AuthError(
        AUTH_ERRORS[error.code] ?? "Ha ocurrido un error inesperado",
      );
    }
    throw error;
  }
}

/** Firestore guarda fechas como Timestamp; la app trabaja con Date. */
function toDate(value: unknown) {
  return value instanceof Timestamp ? value.toDate() : new Date(String(value));
}

export function createFirebaseBackend(): Backend {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  if (!config.apiKey || !config.projectId) {
    throw new Error(
      "VITE_DATA_SOURCE=firebase pero falta la configuración de Firebase en .env (ver .env.example).",
    );
  }

  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const googleProvider = new GoogleAuthProvider();
  auth.useDeviceLanguage();

  // Analytics es opcional: si falla (bloqueadores, sin red) la app sigue igual.
  isSupported()
    .then((ok) => ok && config.measurementId && getAnalytics(app))
    .catch(() => {});

  /* ------------------------------ Helpers ------------------------------ */

  const collections = {
    products: () => collection(db, "products"),
    companies: () => collection(db, "companies"),
    cart: (userId: string) => collection(db, "users", userId, "cart"),
    purchases: (userId: string) => collection(db, "users", userId, "purchases"),
    orders: (companyId: string) =>
      collection(db, "companies", companyId, "orders"),
  };

  const mapDocs = <T>(snap: QuerySnapshot<DocumentData>) =>
    snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);

  const mapOrders = <T extends { orderedAt: Date }>(
    snap: QuerySnapshot<DocumentData>,
  ) =>
    snap.docs.map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
          orderedAt: toDate(d.data().orderedAt),
        }) as unknown as T,
    );

  const toUser = (snap: DocumentSnapshot<DocumentData>) =>
    ({ id: snap.id, ...snap.data() }) as User;

  const uploadImage = async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const getProductById = async (id: string) => {
    const snap = await getDoc(doc(db, "products", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
  };

  const getCompanyByOwner = async (userId: string) => {
    const snap = await getDocs(
      query(collections.companies(), where("userId", "==", userId)),
    );
    const [companyDoc] = snap.docs;
    return companyDoc
      ? ({ id: companyDoc.id, ...companyDoc.data() } as Company)
      : null;
  };

  const createProfileIfMissing = async ({ id, ...profile }: User) => {
    const ref = doc(db, "users", id);
    if ((await getDoc(ref)).exists()) return;
    await setDoc(ref, profile);
  };

  /**
   * Los pedidos creados con la versión anterior no guardaban el id de la
   * compra. Se busca la compra de ese cliente a esa empresa con la fecha más
   * cercana.
   */
  const findLegacyPurchaseId = async (
    companyId: string,
    order: CompanyOrder,
  ) => {
    const snap = await getDocs(
      query(
        collections.purchases(order.userId),
        where("companyId", "==", companyId),
      ),
    );
    const target = order.orderedAt.getTime();
    let best: { id: string; diff: number } | null = null;
    for (const d of snap.docs) {
      const diff = Math.abs(toDate(d.data().orderedAt).getTime() - target);
      if (!best || diff < best.diff) best = { id: d.id, diff };
    }
    return best?.id ?? null;
  };

  /* ------------------------------ Backend ------------------------------ */

  return {
    onAuthChange: (callback) =>
      onAuthStateChanged(auth, (user) =>
        callback(
          user
            ? {
                id: user.uid,
                name: user.displayName ?? "",
                email: user.email ?? "",
              }
            : null,
        ),
      ),

    signUpWithEmail: ({ name, email, password }) =>
      withAuthErrors(async () => {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(user, { displayName: name });
        // La contraseña NUNCA se guarda en Firestore, solo en Firebase Auth.
        await createProfileIfMissing({
          id: user.uid,
          name,
          email,
          provider: "password",
        });
      }),

    signInWithEmail: (email, password) =>
      withAuthErrors(() => signInWithEmailAndPassword(auth, email, password)),

    signInWithGoogle: () =>
      withAuthErrors(async () => {
        const { user } = await signInWithPopup(auth, googleProvider);
        await createProfileIfMissing({
          id: user.uid,
          name: user.displayName ?? "Usuario",
          email: user.email ?? "",
          provider: "google",
        });
      }),

    signOut: () => signOut(auth),

    /* Usuarios */
    getUser: async (id) => {
      const snap = await getDoc(doc(db, "users", id));
      return snap.exists() ? toUser(snap) : null;
    },
    subscribeToUser: (id, onChange) =>
      onSnapshot(doc(db, "users", id), (snap) => {
        if (snap.exists()) onChange(toUser(snap));
      }),
    updateUser: (id, data) =>
      setDoc(doc(db, "users", id), data, { merge: true }),

    /* Empresas */
    getCompanyByOwner,
    createCompany: async (userId, data) => {
      if (await getCompanyByOwner(userId)) {
        throw new Error("Ya tienes una empresa registrada");
      }
      const ref = await addDoc(collections.companies(), { userId, ...data });
      return ref.id;
    },
    updateCompany: (companyId, data) =>
      setDoc(doc(db, "companies", companyId), data, { merge: true }),

    /* Productos */
    getProducts: async () =>
      mapDocs<Product>(await getDocs(collections.products())),
    getProductsByCategory: async (category) =>
      mapDocs<Product>(
        await getDocs(
          query(
            collections.products(),
            where("categories", "array-contains", category),
          ),
        ),
      ),
    getProductsByMaterial: async (material) =>
      mapDocs<Product>(
        await getDocs(
          query(collections.products(), where("materials", "==", material)),
        ),
      ),
    getProductById,
    getCompanyProducts: async (companyId) =>
      mapDocs<Product>(
        await getDocs(
          query(collections.products(), where("companyId", "==", companyId)),
        ),
      ),
    createProduct: async (companyId, data, image) => {
      const ref = await addDoc(collections.products(), { companyId, ...data });
      await uploadImage(imagePaths.product(ref.id), image);
      return ref.id;
    },
    updateProduct: async (productId, data, image) => {
      // updateDoc (y no setDoc) para no borrar campos fuera del formulario.
      await updateDoc(doc(db, "products", productId), data);
      if (image) await uploadImage(imagePaths.product(productId), image);
    },

    /* Carrito */
    subscribeToCart: (userId, onChange) =>
      onSnapshot(collections.cart(userId), (snap) =>
        onChange(mapDocs<CartItem>(snap)),
      ),
    addToCart: async (userId, item) => {
      await addDoc(collections.cart(userId), { ...item, quantity: 1 });
    },
    setCartItemQuantity: async (userId, cartItemId, quantity) => {
      const ref = doc(db, "users", userId, "cart", cartItemId);
      if (quantity <= 0) await deleteDoc(ref);
      else await updateDoc(ref, { quantity });
    },
    removeFromCart: (userId, cartItemId) =>
      deleteDoc(doc(db, "users", userId, "cart", cartItemId)),

    /* Compras y pedidos */
    purchase: async ({ userId, items, address }) => {
      if (items.length === 0) throw new Error("El carrito está vacío");

      // Un pedido por empresa, cada uno solo con los productos de esa empresa.
      const itemsByCompany = new Map<string, CartItem[]>();
      for (const item of items) {
        const product = await getProductById(item.productId);
        if (!product) {
          throw new Error("Uno de los productos del carrito ya no existe");
        }
        const list = itemsByCompany.get(product.companyId) ?? [];
        list.push(item);
        itemsByCompany.set(product.companyId, list);
      }

      // Todo en un batch: o se guarda todo, o no se guarda nada.
      const batch = writeBatch(db);
      const orderedAt = Timestamp.now();

      for (const [companyId, companyItems] of itemsByCompany) {
        const orderRef = doc(collections.orders(companyId));
        const purchaseRef = doc(collections.purchases(userId));
        const common = {
          items: companyItems,
          address,
          state: "pendiente" satisfies OrderState,
          orderedAt,
        };
        batch.set(orderRef, { ...common, userId, purchaseId: purchaseRef.id });
        batch.set(purchaseRef, { ...common, companyId, orderId: orderRef.id });
      }
      for (const item of items) {
        batch.delete(doc(db, "users", userId, "cart", item.id));
      }
      await batch.commit();
    },

    getPurchaseHistory: async (userId) =>
      mapOrders<UserPurchase>(
        await getDocs(
          query(collections.purchases(userId), orderBy("orderedAt", "desc")),
        ),
      ),

    getCompanyOrders: async (companyId) =>
      mapOrders<CompanyOrder>(
        await getDocs(
          query(collections.orders(companyId), orderBy("orderedAt", "desc")),
        ),
      ),

    updateOrderState: async ({ companyId, order, state }) => {
      await updateDoc(doc(db, "companies", companyId, "orders", order.id), {
        state,
      });
      const purchaseId =
        order.purchaseId ?? (await findLegacyPurchaseId(companyId, order));
      if (!purchaseId) return;
      await updateDoc(doc(db, "users", order.userId, "purchases", purchaseId), {
        state,
      });
    },

    /* Imágenes */
    getImageUrl: async (path) => {
      try {
        return await getDownloadURL(ref(storage, path));
      } catch {
        return null;
      }
    },
    uploadImage,
  };
}
