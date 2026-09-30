export type User = {
  id: string;
  name: string;
  email: string;
  provider?: string | null;
  address?: string | null;
  postalcode?: number | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  categories: string[];
  materials: string;
  companyId: string;
};

export type Company = {
  id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  postalcode: number;
  bankType: string;
  bankAccount: string;
  nit: string;
  phone: string;
};

/** Producto dentro del carrito de un usuario (users/{uid}/cart). */
export type CartItem = {
  id: string;
  productId: string;
  price: number;
  quantity: number;
  colors: string[];
  sizes: string[];
};

export type NewCartItem = Omit<CartItem, "id" | "quantity">;

export type OrderState = "pendiente" | "enviado" | "recibido";

/** Compra vista desde el usuario (users/{uid}/purchases). */
export type UserPurchase = {
  id: string;
  companyId: string;
  orderId?: string;
  items: CartItem[];
  address: string;
  state: OrderState;
  orderedAt: Date;
};

/** Pedido visto desde la empresa (companies/{id}/orders). */
export type CompanyOrder = {
  id: string;
  userId: string;
  purchaseId?: string;
  items: CartItem[];
  address: string;
  state: OrderState;
  orderedAt: Date;
};
