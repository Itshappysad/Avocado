import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChangeEvent, useEffect, useState } from "react";
import { storage } from "../../firebase.config";
import { toast } from "sonner";

export default function useProfilePicture(id: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const uploadProfilePicture = async (event: ChangeEvent<HTMLInputElement>) => {
    const toastId = toast.loading('Subiendo imagen')
    const file = event.target?.files?.[0];
    if (!file) return;
    try {
      const storageRef = ref(storage, `profile_images/${id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      toast.success('Imagen subida correctamente', {id: toastId})
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast.error('Error subiendo la imagen', {id:toastId})
    }
  };

  useEffect(() => {
    const getProfileImageUrl = async () => {
      setIsLoading(true);
      try {
        const profileImageRef = ref(storage, `profile_images/${id}`);
        const url = await getDownloadURL(profileImageRef);
        setImageUrl(url);
      } catch (error) {
        console.error("Error al obtener la imagen de perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProfileImageUrl();
  }, [id]);

  return { imageUrl, uploadProfilePicture, isLoading };
}
