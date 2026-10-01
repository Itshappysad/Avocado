/**
 * Contrato común de los backends.
 *
 * La interfaz Backend define TODO lo que la aplicación necesita de una base de
 * datos. Para agregar otro origen de datos (por ejemplo una API propia) basta
 * con escribir un objeto que cumpla esta interfaz.
 */
import type { CompanyFormValues } from "../../schemas/company";
import type { ProductFormValues } from "../../schemas/product";
import type { EditUserValues } from "../../schemas/user";
import type {
  CartItem,
  Company,
  CompanyOrder,
  NewCartItem,
  OrderState,
  Product,
  User,
  UserPurchase,
} from "../types";

/** Datos mínimos de la sesión activa (el perfil completo es `User`). */
export type AuthUser = { id: string; name: string; email: string };

/**
 * Error de autenticación con un mensaje ya listo para mostrar al usuario.
 * Ambos backends lanzan este error para que la interfaz no dependa de Firebase.
 */
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/** Función que cancela una suscripción en tiempo real. */
type Unsubscribe = () => void;

/**
 * Todo lo que la aplicación necesita de una "base de datos".
 *
 * Hay dos implementaciones:
 * - local:    guarda todo en el navegador (localStorage). No necesita internet.
 * - firebase: usa Firebase Auth, Firestore y Storage.
 *
 * Reglas comunes:
 * - Los métodos `subscribeTo…` y `onAuthChange` llaman al callback con el valor
 *   actual apenas se suscriben, y otra vez cada vez que cambia.
 * - Las fechas siempre se devuelven como `Date`.
 * - Los errores de autenticación se lanzan como `AuthError`.
 */
export interface Backend {
  /* ----------------------------- Autenticación ----------------------------- */

  /** Escucha el inicio y cierre de sesión (null = sin sesión). */
  onAuthChange(callback: (user: AuthUser | null) => void): Unsubscribe;
  /** Crea la cuenta y su perfil, y deja la sesión iniciada. */
  signUpWithEmail(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  /** Solo Firebase; el backend local lanza AuthError. */
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;

  /* ------------------------------- Usuarios ------------------------------- */

  getUser(id: string): Promise<User | null>;
  subscribeToUser(id: string, onChange: (user: User) => void): Unsubscribe;
  /** Actualiza solo los campos enviados (fusiona con los existentes). */
  updateUser(id: string, data: EditUserValues): Promise<void>;

  /* ------------------------------- Empresas ------------------------------- */

  getCompanyByOwner(userId: string): Promise<Company | null>;
  /** Devuelve el id de la empresa creada. Falla si el usuario ya tiene una. */
  createCompany(userId: string, data: CompanyFormValues): Promise<string>;
  updateCompany(
    companyId: string,
    data: Partial<CompanyFormValues>,
  ): Promise<void>;

  /* ------------------------------- Productos ------------------------------- */

  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByMaterial(material: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getCompanyProducts(companyId: string): Promise<Product[]>;
  /** Guarda el producto y su imagen; devuelve el id del producto. */
  createProduct(
    companyId: string,
    data: ProductFormValues,
    image: File,
  ): Promise<string>;
  /** Si `image` es null/undefined se conserva la imagen actual. */
  updateProduct(
    productId: string,
    data: ProductFormValues,
    image?: File | null,
  ): Promise<void>;

  /* -------------------------------- Carrito -------------------------------- */

  subscribeToCart(
    userId: string,
    onChange: (items: CartItem[]) => void,
  ): Unsubscribe;
  /** Agrega una línea nueva con cantidad 1. */
  addToCart(userId: string, item: NewCartItem): Promise<void>;
  /** Cambia la cantidad; con 0 o menos elimina la línea. */
  setCartItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<void>;
  removeFromCart(userId: string, cartItemId: string): Promise<void>;

  /* --------------------------- Compras y pedidos --------------------------- */

  /**
   * Registra la compra de `items`: crea un pedido por empresa (solo con sus
   * productos), la compra enlazada en el historial del cliente, y quita esos
   * productos del carrito. Debe ser "todo o nada".
   */
  purchase(input: {
    userId: string;
    items: CartItem[];
    address: string;
  }): Promise<void>;
  /** Ordenado de la compra más reciente a la más antigua. */
  getPurchaseHistory(userId: string): Promise<UserPurchase[]>;
  /** Ordenado del pedido más reciente al más antiguo. */
  getCompanyOrders(companyId: string): Promise<CompanyOrder[]>;
  /** Cambia el estado del pedido y también el de la compra del cliente. */
  updateOrderState(input: {
    companyId: string;
    order: CompanyOrder;
    state: OrderState;
  }): Promise<void>;

  /* -------------------------------- Imágenes -------------------------------- */

  /** URL de la imagen en `path`, o null si no existe. */
  getImageUrl(path: string): Promise<string | null>;
  /** Guarda (o reemplaza) la imagen y devuelve su URL. */
  uploadImage(path: string, file: File): Promise<string>;
}
