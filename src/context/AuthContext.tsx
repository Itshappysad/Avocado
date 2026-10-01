/**
 * Contexto de autenticación.
 *
 * Expone el usuario actual a toda la app con el hook useAuth():
 * - user: perfil del usuario o null si no hay sesión.
 * - isLoading: true mientras se averigua si hay una sesión guardada.
 * - signOut(): cierra la sesión.
 */
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, signOut as authSignOut } from "../core/auth";
import { subscribeToUser } from "../core/database";
import type { User } from "../core/types";

type AuthContextValue = {
  /** Perfil del usuario (colección "users"), o null si no ha iniciado sesión. */
  user: User | null;
  /** true mientras se averigua si hay una sesión guardada (al abrir la app). */
  isLoading: boolean;
  /** Cierra la sesión. */
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Devuelve la sesión actual.
 *
 * @example const { user, isLoading, signOut } = useAuth();
 * @throws Error si se usa fuera de <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}

/**
 * Proveedor de la sesión. Escucha los cambios de sesión del backend y, cuando
 * hay usuario, se suscribe a su perfil para tenerlo siempre actualizado.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthChange((authUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = undefined;

      if (!authUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Datos básicos de inmediato; el perfil completo llega por la suscripción.
      setUser(authUser);
      setIsLoading(false);

      unsubscribeProfile = subscribeToUser(authUser.id, setUser);
    });

    // Limpia las suscripciones al desmontar (evita fugas de memoria).
    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  const signOut = async () => {
    await authSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
