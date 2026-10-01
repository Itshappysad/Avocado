/**
 * Contexto del carrito de compras.
 *
 * El carrito se guarda en el backend (por usuario) y se sincroniza en tiempo
 * real. Cada línea es un producto con una talla y un color concretos; si se
 * agrega de nuevo la misma combinación, se suma a la línea existente.
 *
 * Uso: const { items, add, increase, decrease, remove } = useCart();
 */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";
import {
  addToCart,
  removeFromCart,
  setCartItemQuantity,
  subscribeToCart,
} from "../core/database";
import type { CartItem, NewCartItem } from "../core/types";

type CartContextValue = {
  items: CartItem[];
  /** Número total de unidades en el carrito. */
  totalQuantity: number;
  /** Suma de precio × cantidad (sin envío). */
  subtotal: number;
  /** Si el panel lateral del carrito está abierto. */
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Unidades de un producto en el carrito (sumando todas sus tallas y colores). */
  getProductQuantity: (productId: string) => number;
  /** Agrega una unidad. Si ya existe la misma talla y color, suma a esa línea. */
  add: (item: NewCartItem) => Promise<void>;
  /** Suma una unidad a una línea del carrito. */
  increase: (cartItemId: string) => Promise<void>;
  /** Resta una unidad; si queda en 0 la línea se elimina. */
  decrease: (cartItemId: string) => Promise<void>;
  /** Elimina una línea completa. */
  remove: (cartItemId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Devuelve el carrito y sus acciones.
 *
 * @example
 * const { items, subtotal, add } = useCart();
 * await add({ productId, price, sizes: ["M"], colors: ["#000000"] });
 * @throws Error si se usa fuera de <CartProvider>.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return context;
}

/**
 * Proveedor del carrito. Si no hay sesión el carrito está vacío y, al
 * intentar agregar algo, se envía al usuario a iniciar sesión.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const userId = user?.id;

  // El carrito vive en Firestore y se sincroniza en tiempo real.
  // Al cambiar de usuario (o cerrar sesión) se cancela la suscripción anterior.
  useEffect(() => {
    if (!userId) return;
    const unsubscribe = subscribeToCart(userId, setItems);
    return () => {
      unsubscribe();
      setItems([]);
    };
  }, [userId]);

  /** Dos líneas son la misma si coinciden producto, talla y color. */
  const sameVariant = (a: NewCartItem, b: NewCartItem) =>
    a.productId === b.productId &&
    a.sizes.join() === b.sizes.join() &&
    a.colors.join() === b.colors.join();

  /** Ejecuta una acción del carrito mostrando un aviso si falla. */
  const run = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el carrito");
    }
  };

  const add = async (item: NewCartItem) => {
    if (!userId) {
      toast.info("Inicia sesión para agregar productos al carrito");
      navigate("/signup");
      return;
    }
    const existing = items.find((i) => sameVariant(i, item));
    await run(() =>
      existing
        ? setCartItemQuantity(userId, existing.id, existing.quantity + 1)
        : addToCart(userId, item),
    );
  };

  const changeQuantity = async (cartItemId: string, delta: number) => {
    const existing = items.find((i) => i.id === cartItemId);
    if (!userId || !existing) return;
    await run(() =>
      setCartItemQuantity(userId, existing.id, existing.quantity + delta),
    );
  };

  const remove = async (cartItemId: string) => {
    if (!userId) return;
    await run(() => removeFromCart(userId, cartItemId));
  };

  const value: CartContextValue = {
    items,
    totalQuantity: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    isOpen,
    setOpen,
    getProductQuantity: (productId) =>
      items
        .filter((i) => i.productId === productId)
        .reduce((sum, i) => sum + i.quantity, 0),
    add,
    increase: (cartItemId) => changeQuantity(cartItemId, 1),
    decrease: (cartItemId) => changeQuantity(cartItemId, -1),
    remove,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
