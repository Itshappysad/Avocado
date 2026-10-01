import animate from "tailwindcss-animate";

/**
 * Configuración de Tailwind CSS.
 *
 * - darkMode "class": el modo oscuro solo se activa con la clase "dark"
 *   (así la app no cambia de colores si el sistema operativo está en oscuro).
 * - Colores "brand-*": verde aguacate de la marca (ej: bg-brand-600).
 * - Fuentes: Karla para el texto y Sofia (font-sofia) para el logo y títulos.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: "class",
  // Archivos donde Tailwind busca clases para incluir en el CSS final.
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Verde aguacate: color de acento de la marca.
        brand: {
          50: "#f4f8ec",
          100: "#e6f0d4",
          200: "#cde2ab",
          300: "#adcf78",
          400: "#8fb94f",
          500: "#6f9c33",
          600: "#567c26",
          700: "#435f21",
          800: "#384d1f",
          900: "#30421e",
        },
      },
      fontFamily: {
        sans: ["Karla", "ui-sans-serif", "system-ui", "sans-serif"],
        sofia: ["Sofia", "cursive"],
      },
    },
  },
  plugins: [animate],
};
