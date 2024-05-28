import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { database, getCartItems } from "../core/database";
import { useAuth } from "./useAuth";
import { type Item } from "../core/types";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: string) => number;
  removeFromCart: (id: string) => Promise<void>;
  increaseCartQuantity: (itemData: {
    colors: string[];
    price: number;
    sizes: string[];
    quantity: number;
    productId: string;
  }) => Promise<void>;
  decreaseCartQuantity: (id: string) => Promise<void>;
  cartQuantity: number;
  cartItems: Item[];
};
const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<Item[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;

      const dbItems = await getCartItems();

      console.log(dbItems);

      if (dbItems) setCartItems(dbItems);

      onSnapshot(collection(database, "users", user.id, "cart"), (snap) => {
        const items = snap.docs.map(
          (d) =>
            ({
              id: d.id,
              ...d.data(),
            } as Item),
        );
        setCartItems(items);
      });
    };

    run();
  }, []);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0,
  );

  function getItemQuantity(id: string) {
    return cartItems.find((i) => i.productId === id)?.quantity ?? 0;
  }

  async function increaseCartQuantity(item: {
    colors: string[];
    price: number;
    sizes: string[];
    quantity: number;
    productId: string;
  }) {
    if (!user) return;

    const ref = collection(database, "users", user.id, "cart");

    const itemFound = cartItems.find((i) => i.productId === item.productId);

    if (!itemFound) {
      await addDoc(ref, { ...item, quantity: 1 });
      return;
    }

    const snap = await getDocs(
      query(ref, where("productId", "==", item.productId)),
    );

    const [document] = snap.docs;

    await setDoc(
      document.ref,
      { quantity: item.quantity + 1 },
      { merge: true },
    );
  }

  async function decreaseCartQuantity(id: string) {
    if (!user) return;

    const item = cartItems.find((i) => i.productId === id);

    if (!item) return;

    const ref = doc(database, "users", user.id, "cart", item.id);

    if (item.quantity === 1) {
      await deleteDoc(ref);
      return;
    }

    await setDoc(ref, { quantity: item.quantity - 1 }, { merge: true });
  }

  async function removeFromCart(id: string) {
    if (!user) {
      console.error("User is not defined.");
      return;
    }
  
    const item = cartItems.find((i) => i.productId === id);
  
    if (!item) {
      console.error("Item not found in the cart.");
      return;
    }
  
    const ref = doc(database, "users", user.id, "cart", item.id);
  
    try {
      await deleteDoc(ref);
      console.log(`Item with id ${item.id} successfully deleted from cart.`);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
