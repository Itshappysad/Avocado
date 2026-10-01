/**
 * Hook para leer y reemplazar una imagen del almacenamiento.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getImageUrl, uploadImage } from "../core/storage";

/**
 * Obtiene (y permite reemplazar) una imagen del almacenamiento activo.
 * React Query la guarda en caché, así la misma imagen no se pide varias veces.
 *
 * @param path Ruta de la imagen (ver `imagePaths`), o null para no cargar nada.
 * @returns
 * - url: URL para <img src>, o null si no existe.
 * - isLoading: true mientras se busca.
 * - upload(file): sube una imagen nueva y actualiza `url` al terminar.
 * - isUploading: true mientras se sube.
 *
 * @example
 * const { url, upload } = useStorageImage(imagePaths.profile(user.id));
 */
export function useStorageImage(path: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ["storage-image", path];

  const { data: url, isLoading } = useQuery({
    queryKey,
    queryFn: () => getImageUrl(path!),
    enabled: !!path,
    staleTime: Infinity,
  });

  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => uploadImage(path!, file),
    onSuccess: (newUrl) => {
      queryClient.setQueryData(queryKey, newUrl);
      toast.success("Imagen actualizada");
    },
    onError: () => toast.error("No se pudo subir la imagen"),
  });

  return { url: url ?? null, isLoading, upload, isUploading };
}
