import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "../../firebase.config";
import type {
  Company,
  CompanyOrder,
  Item,
  Product,
  ResgisterUser,
  UserPurchase,
} from "./types";
import { FirebaseError } from "firebase/app";
import { EditUser } from "../schemas/edit";
import { RegisterCompanyForm } from "../schemas/company";
import { auth } from "./auth";
import { RegisterProduct } from "../schemas/product";
import { uploadProductImage } from "./storage";
import { getDifferences } from "./utils";

export const database = getFirestore(app);

export async function registerUser({ id, ...userInfo }: ResgisterUser) {
  try {
    await setDoc(doc(database, "users", id), {
      ...userInfo,
    });
    return true;
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.error(e);
    }
    return false;
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  provider?: string;
  address?: string;
  postalcode?: number;
};

export async function getUser(id: string): Promise<User | null> {
  try {
    const userSnap = await getDoc(doc(database, "users", id));
    if (!userSnap.exists()) return null;
    return { id, ...userSnap.data() } as User;
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.error(e);
    }
    return null;
  }
}

export async function editUser({
  email,
  userData,
}: {
  email: string;
  userData: EditUser;
}) {
  try {
    const userDocs = await getDocs(
      query(collection(database, "users"), where("email", "==", email)),
    );

    const userId = userDocs.docs[0].id;

    await setDoc(doc(database, "users", userId), userData, { merge: true });
    return true;
  } catch (e) {
    return false;
  }
}
export async function getProductsByCategory(
  category: string,
): Promise<Product[] | null> {
  try {
    const itemsRef = collection(database, "products");
    const querySnapshot = await getDocs(
      query(itemsRef, where("categories", "array-contains", category)),
    );

    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product),
    );

    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return null;
  }
}

export async function getProductsByMaterial(
  material: string,
): Promise<Product[] | null> {
  try {
    const itemsRef = collection(database, "products");
    const querySnapshot = await getDocs(
      query(itemsRef, where("materials", "==", material)),
    );

    const products = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Product),
    );

    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return null;
  }
}

export async function getCartItems() {
  const user = auth.currentUser;

  if (!user) return null;

  try {
    const productDocs = await getDocs(
      query(collection(database, "users", user.uid, "cart")),
    );
    const productData = productDocs.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Item),
    );
    return productData;
  } catch (error) {
    return null;
  }
}

export async function createCompanyForUser({
  userId,
  companyData,
}: {
  userId: string;
  companyData: RegisterCompanyForm;
}) {
  try {
    await addDoc(collection(database, "companies"), { userId, ...companyData });
    console.log("Empresa creada exitosamente!");
    return true;
  } catch (error) {
    console.error("Error al crear la empresa:", error);
    return false;
  }
}

export async function editCompany({
  companyData,
  userId,
}: {
  companyData: Partial<RegisterCompanyForm>;
  userId: string;
}) {
  try {
    const company = await getAccountBusiness(userId);

    if (!company) {
      return false;
    }

    await setDoc(
      doc(database, "companies", company.id),
      { ...companyData },
      { merge: true },
    );
    console.log("Empresa creada exitosamente!");
    return true;
  } catch (error) {
    console.error("Error al crear la empresa:", error);
    return false;
  }
}

export async function getAccountBusiness(userId: string) {
  const docs = await getDocs(
    query(collection(database, "companies"), where("userId", "==", userId)),
  );

  const [companyDoc] = docs.docs;

  return docs.docs.length === 0
    ? null
    : ({ id: companyDoc.id, ...companyDoc.data() } as Company);
}

export async function createProductForCompany({
  companyId,
  productData: { image, ...productData },
}: {
  userId: string;
  companyId: string;
  productData: RegisterProduct;
}) {
  try {
    const newProd = await addDoc(collection(database, "products"), {
      companyId,
      ...productData,
    });

    await uploadProductImage(newProd.id, image);

    console.log("Producto creado exitosamente!");
    return true;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return false;
  }
}

export async function editProduct({
  productData: { image, ...productData },
  companyId,
}: {
  companyId: string;
  productData: Partial<RegisterProduct> & {
    id: string;
  };
}) {
  try {
    await setDoc(doc(database, "products", productData.id), {
      ...productData,
      companyId,
    });

    if (image) {
      await uploadProductImage(productData.id, image);
    }
    return true;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return false;
  }
}

export async function getProducts() {
  const docs = await getDocs(query(collection(database, "products")));

  return docs.docs.length === 0
    ? null
    : docs.docs.map(
        (productDoc) =>
          ({ id: productDoc.id, ...productDoc.data() } as Product),
      );
}

export async function getProductById(id: string) {
  const ref = doc(database, "products", id);
  const document = await getDoc(ref);
  return document ? ({ id: document.id, ...document.data() } as Product) : null;
}

export async function getCompanyProducts(userId: string) {
  const company = await getAccountBusiness(userId);

  if (!company) return null;

  const prodDocs = await getDocs(
    query(
      collection(database, "products"),
      where("companyId", "==", company.id),
    ),
  );

  const products = prodDocs.docs.map(
    (d) => ({ id: d.id, ...d.data() } as Product),
  );

  return products;
}

export async function purchase({
  userId,
  items,
  address,
}: {
  userId: string;
  items: Item[];
  address: string;
}) {
  try {
    const products: Product[] = [];

    for (const item of items) {
      const product = await getProductById(item.productId);

      if (!product) {
        return false;
      }

      products.push(product);
    }

    const companies = getDifferences(products, "companyId") as string[];

    for (const company of companies) {
      await addDoc(collection(database, "companies", company, "orders"), {
        userId,
        items,
        address,
        state: "pendiente",
        orderedAt: Timestamp.now(),
      });

      await addDoc(collection(database, "users", userId, "purchases"), {
        companyId: company,
        items,
        address,
        state: "pendiente",
        orderedAt: Timestamp.now(),
      });
    }

    for (const item of items) {
      await deleteDoc(doc(database, "users", userId, "cart", item.id));
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getPurchaseHistory(userId: string) {
  const querySnap = await getDocs(
    collection(database, "users", userId, "purchases"),
  );
  return (
    querySnap.docs.map(
      (pDoc) => ({ id: pDoc.id, ...pDoc.data() } as UserPurchase),
    ) ?? []
  );
}

export async function getOrders(companyId: string) {
  const querySnap = await getDocs(
    collection(database, "companies", companyId, "orders"),
  );

  return (
    querySnap.docs.map(
      (pDoc) => ({ id: pDoc.id, ...pDoc.data() } as CompanyOrder),
    ) ?? []
  );
}

export async function modifyOrderState({
  orderId,
  companyId,
  userId,
  state,
}: {
  companyId: string;
  userId: string;
  state: string;
  orderId: string;
}) {
  await setDoc(
    doc(database, "companies", companyId, "orders", orderId),
    {
      state,
    },
    { merge: true },
  );

  const querySanp = await getDocs(
    query(
      collection(database, "users", userId, "purchases"),
      where("companyId", "==", companyId),
    ),
  );

  const [purDoc] = querySanp.docs;

  await setDoc(
    doc(database, "users", userId, "purchases", purDoc.id),
    {
      state,
    },
    { merge: true },
  );
}
