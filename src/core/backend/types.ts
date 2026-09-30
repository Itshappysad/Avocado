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

/** Datos mínimos de la sesión activa. */
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

type Unsubscribe = () => void;

/**
 * Todo lo que la aplicación necesita de una "base de datos".
 *
 * Hay dos implementaciones:
 * - local:    guarda todo en el navegador (localStorage). No necesita internet.
 * - firebase: usa Firebase Auth, Firestore y Storage.
 */
export interface Backend {
  /* Autenticación */
  onAuthChange(callback: (user: AuthUser | null) => void): Unsubscribe;
  signUpWithEmail(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;

  /* Usuarios */
  getUser(id: string): Promise<User | null>;
  subscribeToUser(id: string, onChange: (user: User) => void): Unsubscribe;
  updateUser(id: string, data: EditUserValues): Promise<void>;

  /* Empresas */
  getCompanyByOwner(userId: string): Promise<Company | null>;
  createCompany(userId: string, data: CompanyFormValues): Promise<string>;
  updateCompany(
    companyId: string,
    data: Partial<CompanyFormValues>,
  ): Promise<void>;

  /* Productos */
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByMaterial(material: string): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getCompanyProducts(companyId: string): Promise<Product[]>;
  createProduct(
    companyId: string,
    data: ProductFormValues,
    image: File,
  ): Promise<string>;
  updateProduct(
    productId: string,
    data: ProductFormValues,
    image?: File | null,
  ): Promise<void>;

  /* Carrito */
  subscribeToCart(
    userId: string,
    onChange: (items: CartItem[]) => void,
  ): Unsubscribe;
  addToCart(userId: string, item: NewCartItem): Promise<void>;
  setCartItemQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<void>;
  removeFromCart(userId: string, cartItemId: string): Promise<void>;

  /* Compras y pedidos */
  purchase(input: {
    userId: string;
    items: CartItem[];
    address: string;
  }): Promise<void>;
  getPurchaseHistory(userId: string): Promise<UserPurchase[]>;
  getCompanyOrders(companyId: string): Promise<CompanyOrder[]>;
  updateOrderState(input: {
    companyId: string;
    order: CompanyOrder;
    state: OrderState;
  }): Promise<void>;

  /* Imágenes */
  getImageUrl(path: string): Promise<string | null>;
  uploadImage(path: string, file: File): Promise<string>;
}
