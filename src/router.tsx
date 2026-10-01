/**
 * Definición de todas las rutas de la aplicación (React Router).
 *
 * Todas las páginas se muestran dentro del layout <App> (navbar + footer).
 * Las rutas que requieren sesión están envueltas en <RequireAuth>, que manda
 * al usuario a /signup si no ha iniciado sesión.
 */
import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { RequireAuth } from "./components/layout/RequireAuth";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreateCompanyPage from "./pages/CreateCompanyPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import StorePage from "./pages/StorePage";
import AccountLayout from "./pages/account/AccountLayout";
import EditProfilePage from "./pages/account/EditProfilePage";
import PurchaseHistoryPage from "./pages/account/PurchaseHistoryPage";
import AddProductPage from "./pages/business/AddProductPage";
import BusinessLayout from "./pages/business/BusinessLayout";
import CompanyOrdersPage from "./pages/business/CompanyOrdersPage";
import CompanyProductsPage from "./pages/business/CompanyProductsPage";
import EditCompanyPage from "./pages/business/EditCompanyPage";

/**
 * Rutas de la aplicación. Para agregar una página nueva: crea el componente en
 * src/pages/ y añade aquí un objeto { path, element }.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Rutas públicas
      { index: true, element: <HomePage /> },
      { path: "store", element: <StorePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "signup", element: <AuthPage /> },

      // Rutas que requieren haber iniciado sesión
      {
        element: <RequireAuth />,
        children: [
          { path: "checkout", element: <CheckoutPage /> },
          { path: "create-company", element: <CreateCompanyPage /> },
          {
            path: "account",
            element: <AccountLayout />,
            children: [
              { index: true, element: <Navigate to="edit" replace /> },
              { path: "edit", element: <EditProfilePage /> },
              { path: "history", element: <PurchaseHistoryPage /> },
            ],
          },
          {
            path: "company",
            element: <BusinessLayout />,
            children: [
              { index: true, element: <Navigate to="products" replace /> },
              { path: "products", element: <CompanyProductsPage /> },
              { path: "add-product", element: <AddProductPage /> },
              { path: "orders", element: <CompanyOrdersPage /> },
              { path: "edit", element: <EditCompanyPage /> },
            ],
          },
        ],
      },

      // Direcciones de la versión anterior (para no romper enlaces guardados)
      { path: "payment", element: <Navigate to="/checkout" replace /> },
      {
        path: "createcompany",
        element: <Navigate to="/create-company" replace />,
      },
      {
        path: "company/addProducts",
        element: <Navigate to="/company/add-product" replace />,
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
