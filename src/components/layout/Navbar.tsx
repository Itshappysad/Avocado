/**
 * Barra de navegación superior (logo, enlaces, carrito y cuenta).
 */
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { AccountSheet } from "../AccountSheet";
import { Button } from "../ui/button";
import { cn } from "../../core/utils";

/** Enlaces principales del menú. `end` hace que "/" solo se active en el inicio. */
const links = [
  { to: "/", label: "Inicio", end: true },
  { to: "/store", label: "Productos" },
  { to: "/about", label: "Nosotros" },
];

/** Enlace del menú; se subraya en verde cuando es la página actual. */
function NavItem({
  to,
  label,
  end,
  onClick,
}: (typeof links)[number] & { onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "rounded-md px-3 py-2 font-semibold text-neutral-600 transition-colors hover:text-neutral-900",
          isActive &&
            "text-neutral-900 underline decoration-brand-500 decoration-2 underline-offset-8",
        )
      }
    >
      {label}
    </NavLink>
  );
}

/**
 * Barra superior fija. En celulares los enlaces se esconden en un menú
 * desplegable. El ícono de usuario abre el panel "Mi cuenta" o, si no hay
 * sesión, se muestra el botón "Ingresar".
 */
export function Navbar() {
  const { totalQuantity, setOpen: setCartOpen } = useCart();
  const { user } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>

        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src="/imgs/AeVlogo.jpeg"
            alt=""
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <span className="truncate font-sofia text-xl font-bold sm:text-3xl">
            Avocado e Vestiti
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito (${totalQuantity} productos)`}
          >
            <ShoppingBag className="size-5" />
            {totalQuantity > 0 && (
              <span className="absolute -bottom-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            )}
          </Button>

          {user ? (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAccountOpen(true)}
              aria-label="Abrir mi cuenta"
            >
              <UserRound className="size-5" />
            </Button>
          ) : (
            <Button asChild>
              <Link to="/signup">Ingresar</Link>
            </Button>
          )}
        </div>
      </div>

      {menuOpen && (
        <nav className="container flex flex-col gap-1 border-t py-3 md:hidden">
          {links.map((link) => (
            <NavItem
              key={link.to}
              {...link}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      )}

      <AccountSheet open={accountOpen} onOpenChange={setAccountOpen} />
    </header>
  );
}
