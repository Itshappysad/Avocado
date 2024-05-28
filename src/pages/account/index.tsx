import "./styles.css";
import { Link, Outlet } from "react-router-dom";
import { cn } from "../../core/utils";
import { useAuth } from "../../context/useAuth";

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

function User() {
  const { user } = useAuth();

  return (
    <div className="company-layout h-full">
      <header className="py-5 shadow-md header">
        <h2 className="text-center text-3xl font-sofia">
          Administra tu cuenta {user?.name}
        </h2>
      </header>
      <aside className="side flex flex-col justify-center p-3 gap-4">
        <AsideLink to="/account/edit">Editar</AsideLink>
        <AsideLink to="/account/history">Mis compras</AsideLink>
      </aside>
      <main className="main overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default User;
