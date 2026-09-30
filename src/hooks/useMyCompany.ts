import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getCompanyByOwner } from "../core/database";

/** Empresa del usuario actual (null si aún no ha creado una). */
export function useMyCompany() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["company", user?.id],
    queryFn: () => getCompanyByOwner(user!.id),
    enabled: !!user,
  });
}
