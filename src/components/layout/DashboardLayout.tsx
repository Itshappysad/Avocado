/**
 * Layout con menú lateral para los paneles "Mi cuenta" y "Mi empresa".
 */
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../core/utils";

type DashboardLayoutProps = {
  /** Título del panel (arriba del menú). */
  title: string;
  /** Opciones del menú lateral. La activa se resalta en negro. */
  links: { to: string; label: string; icon?: React.ReactNode }[];
};

/** Layout con menú lateral usado por "Mi cuenta" y "Mi empresa". */
export function DashboardLayout({ title, links }: DashboardLayoutProps) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="min-w-0">
        <h1 className="mb-4 font-sofia text-3xl">{title}</h1>
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
                  isActive &&
                    "bg-neutral-900 text-white hover:bg-neutral-900 hover:text-white",
                )
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
