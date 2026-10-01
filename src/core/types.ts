/**
 * Tipos de datos del dominio (usuarios, productos, empresas, carrito y pedidos).
 *
 * Son independientes de la base de datos: tanto el backend local como el de
 * Firebase devuelven exactamente estas formas.
 */

/** Perfil de un usuario registrado. */
export type User = {
  /** Identificador único (en Firebase es el uid de Auth). */
  id: string;
  name: string;
  email: string;
  /** Cómo se registró: "password", "google" o "local". */
  provider?: string | null;
  /** Dirección de entrega por defecto (se usa para autocompletar el checkout). */
  address?: string | null;
  postalcode?: number | null;
};

/** Prenda publicada por una empresa. */
export type Product = {
  id: string;
  name: string;
  /** Precio en pesos colombianos (COP), sin decimales. */
  price: number;
  /** Colores disponibles en formato hex, ej: "#1e3a8a". */
  colors: string[];
  /** Tallas disponibles, ej: ["S", "M", "L"]. */
  sizes: string[];
  /** Categorías (ver CATEGORY_OPTIONS), ej: ["Camisa"]. */
  categories: string[];
  /** Material principal (ver MATERIAL_OPTIONS), ej: "algodon". */
  materials: string;
  /** Empresa que publicó el producto. */
  companyId: string;
};

/** Empresa (marca) que vende productos en la tienda. Cada usuario puede tener una. */
export type Company = {
  id: string;
  /** Usuario dueño de la empresa. */
  userId: string;
  name: string;
  email: string;
  address: string;
  postalcode: number;
  /** Banco (ver BANK_OPTIONS). */
  bankType: string;
  bankAccount: string;
  /** NIT con dígito de verificación, ej: "900123456-7". */
  nit: string;
  phone: string;
};

/**
 * Línea del carrito: un producto con una talla y un color concretos.
 * También se usa como línea dentro de las compras y los pedidos.
 */
export type CartItem = {
  id: string;
  productId: string;
  /** Precio unitario al momento de agregarlo al carrito. */
  price: number;
  quantity: number;
  /** Color elegido (lista por compatibilidad con datos antiguos). */
  colors: string[];
  /** Talla elegida (lista por compatibilidad con datos antiguos). */
  sizes: string[];
};

/** Datos para agregar una línea nueva al carrito (el id y la cantidad los pone el backend). */
export type NewCartItem = Omit<CartItem, "id" | "quantity">;

/** Estado de un pedido. Avanza de "pendiente" a "enviado" y luego a "recibido". */
export type OrderState = "pendiente" | "enviado" | "recibido";

/**
 * Compra vista desde el cliente (su historial).
 * Está enlazada con un CompanyOrder por medio de `orderId`.
 */
export type UserPurchase = {
  id: string;
  /** Empresa a la que se le compró. */
  companyId: string;
  /** Pedido correspondiente en la empresa (puede faltar en datos antiguos). */
  orderId?: string;
  items: CartItem[];
  /** Dirección de entrega completa en una sola línea. */
  address: string;
  state: OrderState;
  orderedAt: Date;
};

/**
 * Pedido visto desde la empresa.
 * Cuando una compra incluye productos de varias empresas, cada una recibe su
 * propio pedido solo con sus productos.
 */
export type CompanyOrder = {
  id: string;
  /** Cliente que hizo el pedido. */
  userId: string;
  /** Compra correspondiente en el historial del cliente (puede faltar en datos antiguos). */
  purchaseId?: string;
  items: CartItem[];
  address: string;
  state: OrderState;
  orderedAt: Date;
};
