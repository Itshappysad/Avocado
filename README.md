# Avocado e Vestiti

Tienda de ropa en línea donde las marcas publican sus prendas y los clientes
las compran. Proyecto hecho con **React + TypeScript + Vite**.

Funciona de dos formas:

- **Modo local (por defecto):** no necesita internet ni base de datos. Trae
  cuentas, empresas, productos (con imágenes) y pedidos de ejemplo, y guarda
  todo lo que hagas en el navegador (`localStorage`).
- **Modo Firebase:** usa Firebase Auth, Firestore y Storage como base de datos
  real.

## Funcionalidades

**Clientes**

- Registro e inicio de sesión con correo (y con Google en modo Firebase).
- Catálogo con búsqueda y filtro por categoría; secciones por categoría y
  material en la página de inicio.
- Detalle de producto con selección de talla y color.
- Carrito sincronizado en tiempo real (entre pestañas en modo local, entre
  dispositivos en modo Firebase).
- Checkout con formulario de entrega y resumen del pedido.
- Perfil editable (nombre, dirección, código postal y foto) e historial de
  compras con el estado de cada pedido.

**Empresas**

- Cada usuario puede registrar una empresa (NIT, datos bancarios y de contacto).
- Publicar y editar productos: nombre, precio, material, tallas, categorías,
  colores e imagen.
- Ver los pedidos recibidos y cambiar su estado (pendiente → enviado →
  recibido); el cliente ve el cambio en su historial.

## Requisitos

- [Node.js](https://nodejs.org/) 20 o superior.

## Cómo ejecutarlo

```bash
npm install
npm run dev      # abre http://localhost:5173
```

Eso es todo: arranca en **modo local** con datos de ejemplo.

### Cuentas de prueba (modo local)

| Correo            | Contraseña    | Qué puedes probar                                     |
| ----------------- | ------------- | ----------------------------------------------------- |
| `demo@avocado.co` | `avocado1234` | Comprar y administrar la empresa «Avocado e Vestiti»  |
| `lucia@correo.co` | `cliente1234` | Cliente con compras anteriores (ve cambios de estado) |

También puedes crear tu propia cuenta y tu propia empresa. En la pantalla de
inicio de sesión hay botones para entrar con estas cuentas en un clic, y en el
pie de página un enlace para **restablecer los datos de ejemplo**.

> En modo local los datos viven solo en ese navegador: otro navegador u otro
> computador empiezan con los datos de ejemplo.

### Usar Firebase

1. Crea un proyecto en [Firebase](https://console.firebase.google.com/) con
   Authentication (correo y Google), Firestore y Storage.
2. Copia `.env.example` como `.env` (en Windows: `copy .env.example .env`).
3. Pon `VITE_DATA_SOURCE=firebase` y llena los valores `VITE_FIREBASE_*`.
4. Reinicia `npm run dev`.

### Scripts

| Comando             | Qué hace                                                      |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con recarga en caliente                |
| `npm run build`     | Revisa los tipos y genera la versión de producción en `dist/` |
| `npm run preview`   | Sirve localmente la versión de producción                     |
| `npm run typecheck` | Solo revisa los tipos de TypeScript                           |
| `npm run lint`      | Busca errores y malas prácticas con ESLint                    |
| `npm run format`    | Formatea todo el código con Prettier                          |

## Estructura del proyecto

```
src/
├── main.tsx            # Punto de entrada: providers (React Query, Auth) y router
├── router.tsx          # Todas las rutas de la aplicación
├── App.tsx             # Layout principal (navbar, contenido, footer, carrito)
├── core/               # Lógica sin interfaz
│   ├── backend/        #   Origen de los datos (elegido con VITE_DATA_SOURCE)
│   │   ├── types.ts    #     Interfaz común que implementan los dos backends
│   │   ├── local/      #     Datos en el navegador + datos de ejemplo (seed.ts)
│   │   └── firebase/   #     Firebase Auth, Firestore y Storage
│   ├── auth.ts         #   Registro, inicio y cierre de sesión
│   ├── database.ts     #   Consultas (usuarios, productos, carrito, pedidos)
│   ├── storage.ts      #   Subida y descarga de imágenes
│   ├── constants.ts    #   Tallas, categorías, bancos, costo de envío...
│   ├── types.ts        #   Tipos de datos (User, Product, Company, ...)
│   └── utils.ts        #   Utilidades (formato de moneda, colores, clases CSS)
├── context/            # Estado global: sesión (AuthContext) y carrito (CartContext)
├── hooks/              # Hooks reutilizables (imágenes, empresa del usuario)
├── schemas/            # Validaciones de formularios con Zod
├── components/
│   ├── ui/             #   Componentes base (botón, input, diálogo, panel lateral…)
│   ├── layout/         #   Navbar, Footer, layout de paneles y protección de rutas
│   ├── auth/           #   Formularios de inicio de sesión y registro
│   ├── checkout/       #   Formulario de pago y resumen del pedido
│   └── *.tsx           #   Componentes de la tienda (ProductCard, CartSheet, …)
└── pages/              # Una página por ruta
    ├── account/        #   "Mi cuenta": perfil e historial de compras
    └── business/       #   "Mi empresa": productos, pedidos y datos
```

## Rutas

| Ruta                   | Página                        | Requiere sesión |
| ---------------------- | ----------------------------- | :-------------: |
| `/`                    | Inicio                        |                 |
| `/store`               | Tienda                        |                 |
| `/about`               | Sobre nosotros                |                 |
| `/signup`              | Iniciar sesión / crear cuenta |                 |
| `/checkout`            | Finalizar compra              |        ✔        |
| `/account/edit`        | Mi perfil                     |        ✔        |
| `/account/history`     | Mis compras                   |        ✔        |
| `/create-company`      | Crear empresa                 |        ✔        |
| `/company/products`    | Productos de mi empresa       |        ✔        |
| `/company/add-product` | Publicar producto             |        ✔        |
| `/company/orders`      | Pedidos recibidos             |        ✔        |
| `/company/edit`        | Datos de la empresa           |        ✔        |

## Modelo de datos

```
users/{userId}                     name, email, provider, address, postalcode
  ├── cart/{itemId}                productId, price, quantity, sizes[], colors[]
  └── purchases/{purchaseId}       companyId, orderId, items[], address, state, orderedAt
companies/{companyId}              userId, name, nit, bankType, bankAccount, address, ...
  └── orders/{orderId}             userId, purchaseId, items[], address, state, orderedAt
products/{productId}               companyId, name, price, materials, sizes[], categories[], colors[]
```

Imágenes: `product_images/{productId}` y `profile_images/{userId}` (en
Storage, o en `localStorage` en modo local). Las imágenes por defecto de los
productos de ejemplo están en `public/imgs/products/`.

## Tecnologías

React 18 · TypeScript · Vite · React Router 7 · TanStack Query · React Hook
Form + Zod · Tailwind CSS · Radix UI (componentes estilo shadcn/ui) · Firebase
(opcional) · Sonner (notificaciones) · Lucide (íconos)

## Equipo

- Juan Esteban Sierra
- Andrés Martínez Martínez
- Nicolás López
