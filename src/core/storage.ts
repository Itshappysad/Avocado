import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase.config";

export async function getProductImage(id: string) {
  try {
    const image = await getDownloadURL(ref(storage, `product_images/${id}`));
    return image;
  } catch (e) {
    return null;
  }
}

export async function uploadProductImage(id: string, file: File) {
  try {
    const storageRef = ref(storage, `product_images/${id}`);
    await uploadBytes(storageRef, file);
    return true;
  } catch (e) {
    return false;
  }
}
