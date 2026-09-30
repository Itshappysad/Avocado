/**
 * Datos de ejemplo para el modo local: usuarios, empresas, productos y pedidos.
 * Las imágenes de los productos están en public/imgs/products/.
 */
import type { CartItem, Product } from "../../types";
import { imagePaths } from "../../constants";
import { hashPassword } from "./password";
import type { LocalDb, StoredOrder, StoredPurchase } from "./store";

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL"];
const PANTS_SIZES = ["S", "M", "L", "XL", "XXL"];

const products: Product[] = [
  {
    id: "p-camisa-oxford",
    name: "Camisa Oxford",
    price: 119900,
    materials: "algodon",
    categories: ["Camisa"],
    colors: ["#bfdbfe", "#ffffff", "#fbcfe8"],
    sizes: SHIRT_SIZES,
    companyId: "c-avocado",
  },
  {
    id: "p-camiseta-basica",
    name: "Camiseta básica",
    price: 49900,
    materials: "algodon",
    categories: ["Camisa"],
    colors: ["#6f9c33", "#f5f5f4", "#111827"],
    sizes: SHIRT_SIZES,
    companyId: "c-avocado",
  },
  {
    id: "p-blusa-seda",
    name: "Blusa de seda",
    price: 159900,
    materials: "seda",
    categories: ["Camisa"],
    colors: ["#fcd34d", "#f5f5f4", "#be123c"],
    sizes: ["XS", "S", "M", "L"],
    companyId: "c-avocado",
  },
  {
    id: "p-camisa-seda",
    name: "Camisa de seda",
    price: 179900,
    materials: "seda",
    categories: ["Camisa"],
    colors: ["#0f766e", "#312e81"],
    sizes: SHIRT_SIZES,
    companyId: "c-avocado",
  },
  {
    id: "p-pantalon-chino",
    name: "Pantalón chino",
    price: 139900,
    materials: "algodon",
    categories: ["Pantalon"],
    colors: ["#c8b68e", "#1f2937", "#435f21"],
    sizes: PANTS_SIZES,
    companyId: "c-avocado",
  },
  {
    id: "p-jogger",
    name: "Jogger deportivo",
    price: 99900,
    materials: "poliester",
    categories: ["Pantalon"],
    colors: ["#374151", "#111827"],
    sizes: PANTS_SIZES,
    companyId: "c-avocado",
  },
  {
    id: "p-polo-pique",
    name: "Polo piqué",
    price: 89900,
    materials: "poliester",
    categories: ["Camisa"],
    colors: ["#1e3a5f", "#b91c1c", "#f5f5f4"],
    sizes: SHIRT_SIZES,
    companyId: "c-lana-lino",
  },
  {
    id: "p-camisa-franela",
    name: "Camisa de franela",
    price: 139900,
    materials: "lana",
    categories: ["Camisa"],
    colors: ["#991b1b", "#374151"],
    sizes: SHIRT_SIZES,
    companyId: "c-lana-lino",
  },
  {
    id: "p-jean-slim",
    name: "Jean slim",
    price: 149900,
    materials: "algodon",
    categories: ["Pantalon"],
    colors: ["#1e3a8a", "#111827"],
    sizes: PANTS_SIZES,
    companyId: "c-lana-lino",
  },
  {
    id: "p-pantalon-lana",
    name: "Pantalón de lana",
    price: 189900,
    materials: "lana",
    categories: ["Pantalon"],
    colors: ["#57534e", "#1c1917"],
    sizes: PANTS_SIZES,
    companyId: "c-lana-lino",
  },
];

/** Imagen por defecto de cada producto de ejemplo. */
export const SEED_IMAGES: Record<string, string> = Object.fromEntries(
  products.map((p) => [imagePaths.product(p.id), `/imgs/products/${p.id}.svg`]),
);

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

function line(
  id: string,
  productId: string,
  size: string,
  color: string,
  quantity = 1,
): CartItem {
  const product = products.find((p) => p.id === productId)!;
  return {
    id,
    productId,
    price: product.price,
    quantity,
    sizes: [size],
    colors: [color],
  };
}

/** Crea un pedido de una empresa y la compra enlazada del cliente. */
function order(
  n: number,
  userId: string,
  companyId: string,
  items: CartItem[],
  address: string,
  state: StoredOrder["state"],
  orderedAt: string,
) {
  const orderId = `o-${n}`;
  const purchaseId = `pu-${n}`;
  const common = { items, address, state, orderedAt };
  return {
    order: { id: orderId, userId, purchaseId, ...common } as StoredOrder,
    purchase: {
      id: purchaseId,
      companyId,
      orderId,
      ...common,
    } as StoredPurchase,
  };
}

export function createSeed(): LocalDb {
  const luciaAddress = "Carrera 45 # 12-30 · Medellín, Antioquia · 050021";
  const demoAddress = "Calle 10 # 5-20 · Cali, Valle del Cauca · 760001";

  const history = [
    order(
      1,
      "u-lucia",
      "c-avocado",
      [line("l1", "p-blusa-seda", "S", "#fcd34d")],
      luciaAddress,
      "enviado",
      daysAgo(4),
    ),
    order(
      2,
      "u-lucia",
      "c-lana-lino",
      [line("l2", "p-jean-slim", "M", "#1e3a8a")],
      luciaAddress,
      "pendiente",
      daysAgo(4),
    ),
    order(
      3,
      "u-lucia",
      "c-avocado",
      [line("l3", "p-camiseta-basica", "M", "#6f9c33", 2)],
      luciaAddress,
      "recibido",
      daysAgo(18),
    ),
    order(
      4,
      "u-demo",
      "c-lana-lino",
      [line("l4", "p-polo-pique", "L", "#1e3a5f")],
      demoAddress,
      "pendiente",
      daysAgo(2),
    ),
  ];

  const db: LocalDb = {
    users: {
      "u-demo": {
        id: "u-demo",
        name: "Cuenta Demo",
        email: "demo@avocado.co",
        provider: "local",
        address: "Calle 10 # 5-20, Cali",
        postalcode: 760001,
        passwordHash: hashPassword("avocado1234", "demo"),
      },
      "u-lucia": {
        id: "u-lucia",
        name: "Lucía Gómez",
        email: "lucia@correo.co",
        provider: "local",
        address: "Carrera 45 # 12-30, Medellín",
        postalcode: 50021,
        passwordHash: hashPassword("cliente1234", "lucia"),
      },
      "u-mateo": {
        id: "u-mateo",
        name: "Mateo Rojas",
        email: "mateo@correo.co",
        provider: "local",
        passwordHash: hashPassword("mateo123456", "mateo"),
      },
    },
    companies: {
      "c-avocado": {
        id: "c-avocado",
        userId: "u-demo",
        name: "Avocado e Vestiti",
        nit: "900123456-7",
        bankType: "Bancolombia",
        bankAccount: "1234567890",
        address: "Calle 10 # 5-20, Cali",
        postalcode: 760001,
        email: "hola@avocado.co",
        phone: "3001234567",
      },
      "c-lana-lino": {
        id: "c-lana-lino",
        userId: "u-mateo",
        name: "Lana & Lino Taller",
        nit: "901765432-1",
        bankType: "Davivienda",
        bankAccount: "9876543210",
        address: "Calle 72 # 9-15, Bogotá",
        postalcode: 110221,
        email: "taller@lanaylino.co",
        phone: "3109876543",
      },
    },
    products: Object.fromEntries(products.map((p) => [p.id, p])),
    carts: {},
    purchases: {},
    orders: {},
  };

  for (const { order: o, purchase: p } of history) {
    (db.orders[p.companyId] ??= {})[o.id] = o;
    (db.purchases[o.userId] ??= {})[p.id] = p;
  }

  return db;
}
