import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind resolviendo conflictos. */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

/** Indica si un color hex (#rrggbb) es claro, para elegir texto negro o blanco encima. */
export function isLightColor(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!match) return true;
  const [r, g, b] = match.slice(1).map((h) => parseInt(h, 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;
}

/** Agrega o quita un valor de una lista (útil para selecciones múltiples). */
export function toggleValue<T>(list: T[], value: T) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}
