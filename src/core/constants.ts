/**
 * Valores fijos que usa la aplicación: opciones de los formularios, costo de
 * envío, estados de un pedido y rutas de las imágenes.
 *
 * Si quieres agregar una talla, un material o un banco, se hace aquí.
 */

/** Costo fijo de envío dentro de Colombia (COP). */
export const SHIPPING_COST = 12_500;

/** Tallas disponibles al publicar un producto. */
export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

/**
 * Categorías de prenda. `value` es lo que se guarda en la base de datos
 * (no cambiarlo o los productos existentes dejarán de aparecer en su sección);
 * `label` es el texto que ve el usuario.
 */
export const CATEGORY_OPTIONS = [
  { value: "Camisa", label: "Camisas" },
  { value: "Pantalon", label: "Pantalones" },
];

/** Materiales de los productos (se usan también en las secciones del inicio). */
export const MATERIAL_OPTIONS = [
  { value: "algodon", label: "Algodón" },
  { value: "poliester", label: "Poliéster" },
  { value: "seda", label: "Seda" },
  { value: "lana", label: "Lana" },
];

/** Bancos disponibles en el formulario de empresa. */
export const BANK_OPTIONS = [
  { value: "Bancolombia", label: "Bancolombia" },
  { value: "BBVA", label: "BBVA Colombia" },
  { value: "BancoBogota", label: "Banco de Bogotá" },
  { value: "Davivienda", label: "Davivienda" },
  { value: "Citibank", label: "Citibank Colombia" },
  { value: "Colpatria", label: "Scotiabank Colpatria" },
];

/** Estados por los que pasa un pedido, en orden. */
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
