import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useEffect, useState } from "react";
import { storage } from "../../firebase.config";
import { toast } from "sonner";

export default function useCompanyPicture(id: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadCompanyPicture = async (event: ChangeEvent<HTMLInputElement>) => {
    const toastId = toast.loading("Subiendo imagen");
    const file = event.target?.files?.[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `company_images/${id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      toast.success("Imagen subida correctamente", { id: toastId });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error("Error subiendo la imagen", { id: toastId });
    }
  };

  useEffect(() => {
    const getCompanyImageUrl = async () => {
      setIsLoading(true);
      try {
        const companyImageRef = ref(storage, `company_images/${id}`);
        const url = await getDownloadURL(companyImageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error al obtener la imagen de perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCompanyImageUrl();
  }, [id]);

  return { imageUrl, uploadCompanyPicture, isLoading };
}
