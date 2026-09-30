/** Costo fijo de envío dentro de Colombia (COP). */
export const SHIPPING_COST = 12_500;

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const CATEGORY_OPTIONS = [
  { value: "Camisa", label: "Camisas" },
  { value: "Pantalon", label: "Pantalones" },
];

export const MATERIAL_OPTIONS = [
  { value: "algodon", label: "Algodón" },
  { value: "poliester", label: "Poliéster" },
  { value: "seda", label: "Seda" },
  { value: "lana", label: "Lana" },
];

export const BANK_OPTIONS = [
  { value: "Bancolombia", label: "Bancolombia" },
  { value: "BBVA", label: "BBVA Colombia" },
  { value: "BancoBogota", label: "Banco de Bogotá" },
  { value: "Davivienda", label: "Davivienda" },
  { value: "Citibank", label: "Citibank Colombia" },
  { value: "Colpatria", label: "Scotiabank Colpatria" },
];

export const ORDER_STATES = [
  { value: "pendiente", label: "Pendiente" },
  { value: "enviado", label: "Enviado" },
  { value: "recibido", label: "Recibido" },
] as const;

/** Rutas de las imágenes en el almacenamiento (Storage o local). */
export const imagePaths = {
  product: (productId: string) => `product_images/${productId}`,
  profile: (userId: string) => `profile_images/${userId}`,
};
