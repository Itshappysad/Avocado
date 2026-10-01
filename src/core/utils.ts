/**
 * Funciones de utilidad pequeñas y sin estado, usadas en toda la app.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind y resuelve conflictos (la última gana).
 *
 * @example cn("p-2 bg-white", isActive && "bg-black") // "p-2 bg-black"
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/**
 * Da formato de pesos colombianos a un número.
 *
 * @example formatCurrency(119900) // "$ 119.900"
 */
export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

/**
 * Indica si un color es claro, para decidir si el texto o ícono encima debe
 * ser negro (color claro) o blanco (color oscuro).
 *
 * @param hex Color en formato "#rrggbb".
 */
export function isLightColor(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return true;
  const [r, g, b] = match.slice(1).map((h) => parseInt(h, 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
}

/**
 * Agrega el valor a la lista si no está, o lo quita si ya está.
 * Devuelve una lista nueva (no modifica la original).
 *
 * @example toggleValue(["S", "M"], "M") // ["S"]
 */
export function toggleValue<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}
