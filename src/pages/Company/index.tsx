import { useQuery } from "@tanstack/react-query";
import { getAccountBusiness } from "../../core/database";
import LoadingIcon from "../../components/icons/loading";
import "./styles.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { cn } from "../../core/utils";
import { useAuth } from "../../context/useAuth";
import { useEffect } from "react";

function AsideLink({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      className={cn(
        `
          text-lg text-center py-2 px-1 rounded-md border border-black no-underline text-black font-bold transition-transform
          hover:scale-105 hover:shadow
        `,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

function Company() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: company,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["company"],
    queryFn: async () => {
      if (!user) {
        return "no com";
      }

      const company = await getAccountBusiness(user.id);

      if (!company) {
        return "no com";
      }

      return company;
    },
  });

  useEffect(() => {
    if (typeof company === "string") {
      navigate("/createcompany");
    }
  }, [company]);

  if (typeof company === "string") {
    return <LoadingIcon />;
  }

  return (
    <>
      {!isLoading && company ? (
        <div className="company-layout h-full">
          <header className="py-5 shadow-md header">
            <h2 className="text-center text-3xl font-sofia">
              Bienvenido a {company.name}
            </h2>
          </header>
          <aside className="side flex flex-col justify-center p-3 gap-4">
            <AsideLink to="/Company/edit">Editar</AsideLink>
            <AsideLink to="/Company/products">Mis productos</AsideLink>
            <AsideLink to="/Company/addProducts">Añadir Productos</AsideLink>
            <AsideLink to="/Company/orders">Ordenes</AsideLink>
          </aside>
          <main className="main overflow-auto">
            <Outlet />
          </main>
        </div>
      ) : (
        <LoadingIcon className="text-3xl" />
      )}
      {error && <p>Error: {error.toString()}</p>}
    </>
  );
}

export default Company;
