# Revisión y cambios (septiembre 2026)

## Tercera ronda: documentación

- Todo el código quedó documentado en español: cada archivo empieza con un
  comentario que explica su propósito, y cada componente, hook, función, tipo
  y prop exportado tiene JSDoc (el editor lo muestra al pasar el mouse).
- README reescrito: capturas de pantalla, diagramas de arquitectura y del
  flujo de compra, configuración, modelo de datos, guías rápidas, convenciones
  y solución de problemas.
- Las fuentes Karla y Sofia ahora vienen incluidas en el proyecto
  (`@fontsource`), así la app se ve igual sin internet.
- La página «Sobre nosotros» y el README muestran solo a Andrés Martínez
  Martínez en el equipo.

## Segunda ronda: modo local y seguridad

- **Modo local por defecto:** la base de datos de Firebase ya no existe, así que
  la app ahora funciona sin ella. Todo (cuentas, carrito, empresas, productos,
  pedidos e imágenes subidas) se guarda en el navegador. Trae datos de ejemplo
  y cuentas de prueba (ver README).
- **Firebase sigue disponible** poniendo `VITE_DATA_SOURCE=firebase` en `.env`.
  Su código solo se descarga en ese modo (la app local pesa ~750 kB menos).
- **Imágenes por defecto:** ilustraciones SVG propias para los 10 productos de
  ejemplo (`public/imgs/products/`) y una imagen de respaldo para productos
  sin foto o con enlace roto.
- **Vulnerabilidades:** las 4 de severidad alta venían de `@grpc/grpc-js`, una
  dependencia interna de Firebase. Se forzó la versión corregida (1.14.5) con
  `overrides` en `package.json`; `npm audit` ya reporta 0 vulnerabilidades.
- **Bootstrap:** confirmado que no queda ningún uso; todos los componentes son
  propios (Tailwind + Radix).
- Corregido: al crear una empresa, a veces te llevaba a «Mis productos» en vez
  de a «Añadir producto».

## Primera ronda

Resumen de lo que se cambió al actualizar y limpiar el proyecto. La versión
anterior sigue en el historial de git (`git log`, `git diff`).

### ⚠️ Si vuelves a usar Firebase

1. **Borrar las contraseñas guardadas en Firestore.** La versión anterior
   guardaba la contraseña en texto plano en `users/{id}.password` al
   registrarse con correo. El código ya no lo hace, pero los documentos viejos
   siguen teniendo ese campo: bórralo desde la consola de Firestore.
2. **Revisar las reglas de seguridad** de Firestore y Storage. Todo se escribe
   desde el navegador, así que sin reglas cualquiera podría modificar productos,
   pedidos o carritos ajenos. Como mínimo: cada usuario solo lee/escribe su
   `users/{uid}` y subcolecciones; solo el dueño de una empresa edita sus
   productos y sus pedidos.
3. **Solo si vuelves a usar Firebase:** crea el archivo `.env` a partir de
   `.env.example` con `VITE_DATA_SOURCE=firebase` y los datos del proyecto.

### Dependencias y configuración

- Se actualizaron Vite (5 → 6), Firebase (10 → 12), React Router (6 → 7),
  ESLint (8 → 10, con la nueva configuración `eslint.config.js`) y el resto de
  paquetes a sus últimas versiones compatibles. React se mantiene en la 18.
- Se quitaron dependencias que no se usaban: Bootstrap, React-Bootstrap,
  Syncfusion Grids, lil-gui, @types/three, cmdk, @iconify, react-select y
  varios paquetes de Radix.
- `npm run build` y `npm run lint` fallaban; ahora pasan sin errores.
- Se agregaron Prettier (con orden automático de clases de Tailwind),
  `.editorconfig`, `.gitattributes`, `.gitignore` y `package-lock.json`.
- La configuración de Firebase pasó a variables de entorno (`.env`).
- El código se divide en archivos separados (Firebase y React aparte) para que
  el navegador los guarde en caché.

### Errores corregidos

- **Pedidos con productos de otras empresas:** al comprar, cada empresa recibía
  _todos_ los productos del carrito. Ahora cada pedido solo lleva los suyos, y
  la compra se guarda en una sola operación (o se guarda todo, o nada).
- **Cambiar el estado de un pedido actualizaba la compra equivocada:** se usaba
  el id del dueño de la empresa en vez del cliente, y se tomaba la primera
  compra que encontraba. Ahora pedido y compra quedan enlazados por id (con un
  respaldo para los pedidos viejos).
- **Historial de compras y pedidos de la empresa se mezclaban:** usaban la
  misma clave de caché (`"purchase-his"`).
- **El carrito no cargaba** si se iniciaba sesión después de abrir la página,
  y las suscripciones en tiempo real nunca se cancelaban (fugas de memoria).
- **"Pagar" sin sesión** enviaba a /signUp e inmediatamente a /payment.
- **Añadir productos** redirigía a "crear empresa" mientras aún estaba
  cargando.
- **Editar empresa** mostraba el formulario vacío (los valores se calculaban
  antes de cargar los datos).
- **Editar perfil** buscaba al usuario por correo en vez de por id.
- `getProductById` nunca devolvía `null` (siempre había "documento").
- Las imágenes con ruta relativa (`imgs/AeVlogo.jpeg`) no cargaban en rutas
  como `/account/edit`.
- Los componentes de shadcn se volvían oscuros si el sistema operativo estaba
  en modo oscuro.
- Los nombres de los componentes de agregar/editar producto estaban cruzados.
- El carrito ahora distingue talla y color (antes una línea podía tener varias
  tallas y colores a la vez).

### Código

- Se eliminó código muerto: `Subs.tsx` (lorem ipsum), `carousel2.tsx`,
  `root.tsx`, `SettingsContext`, `auth-protected`, `useLocalStorage`,
  `payuService.ts` (credenciales de prueba y firma falsa), JSON de datos de
  ejemplo, `firebase-debug.log`, `redireccion.txt`, CSS de la plantilla de Vite.
- Se unificó código duplicado: un solo formulario de producto (crear/editar),
  uno de empresa, un layout para "Mi cuenta"/"Mi empresa", un componente de
  línea de producto y un hook para imágenes de Storage.
- Rutas protegidas con `<RequireAuth>` en vez de un `useEffect` en cada página.
- Nombres consistentes y sin errores (`singin` → `signIn`, `ResgisterUser`,
  `ResumnPay` → `OrderSummary`, etc.).
- Errores de Firebase traducidos a mensajes en español para el usuario.
- Validaciones con mensajes en español en todos los formularios.

### Diseño

- Se quitó Bootstrap y todo quedó en Tailwind (antes ambos chocaban).
- Nueva barra de navegación con menú móvil, carrito y cuenta en paneles
  laterales, página de inicio con portada propia (antes usaba un GIF externo de
  Behance), tienda con búsqueda y filtros, diálogo de producto, checkout en dos
  columnas, pedidos con estado de color y página 404.
- Todo es responsive (probado a 390 px y 1280 px).
- Color de acento verde aguacate, fuentes Karla y Sofia cargadas
  correctamente, textos revisados (tildes y ortografía).
