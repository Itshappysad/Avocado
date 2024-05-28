import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16,
      )}`
    : "0, 0, 0";
}

export function getLuminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getDifferences<T extends Object>(objs: T[], target: keyof T) {
  const diff = objs.reduce((acc, current) => {
    const found = acc.find((ob) => ob === current[target]);

    if (found) return acc;

    console.log(current[target]);

    return [...acc, current[target]];
  }, [] as T[typeof target][]);

  return diff;
}
