import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/sign-up/index.tsx";
import { Home } from "./pages/Home.tsx";
import { Store } from "./pages/Store.tsx";
import { About } from "./pages/About.tsx";

import "../firebase.config.ts";
import { AuthProvider } from "./context/useAuth.tsx";
import EditUser from "./pages/account/edit.tsx";
import { Toaster } from "sonner";
import { CreateCompany } from "./pages/CreateCompany.tsx";
import CompanyAddProducts from "./pages/Company/add-prods.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Payment from "./pages/Payment.tsx";
import Company from "./pages/Company/index.tsx";
import CompanyEdit from "./pages/Company/edit.tsx";
import CompanyProducts from "./pages/Company/prods.tsx";
import CompanyOrders from "./pages/Company/orders.tsx";
import User from "./pages/account/index.tsx";
import UserHistory from "./pages/account/history.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/store",
        element: <Store />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/createcompany",
        element: <CreateCompany />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/account",
        element: <User />,
        children: [
          {
            path: "/account/edit",
            element: <EditUser />,
          },
          {
            path: "/account/history",
            element: <UserHistory />,
          },
        ],
      },
      {
        path: "/Company",
        element: <Company />,
        children: [
          {
            path: "/Company/edit",
            element: <CompanyEdit />,
          },
          {
            path: "/Company/products",
            element: <CompanyProducts />,
          },
          {
            path: "/Company/addProducts",
            element: <CompanyAddProducts />,
          },
          {
            path: "/Company/orders",
            element: <CompanyOrders />,
          },
        ],
      },
    ],
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster richColors />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
