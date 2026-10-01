/**
 * Hook con la empresa del usuario que inició sesión.
 */
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCompanyByOwner } from "../core/database";

/**
 * Empresa del usuario actual.
 *
 * `data` es la empresa, o null si aún no ha creado una (undefined mientras
 * carga). Al crear o editar la empresa se debe invalidar la clave ["company"]
 * para que se vuelva a pedir.
 */
export function useMyCompany() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["company", user?.id],
    queryFn: () => getCompanyByOwner(user!.id),
    enabled: !!user,
  });
}
