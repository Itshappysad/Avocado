import { Timestamp } from "firebase/firestore";

export type ResgisterUser = {
  name: string;
  email: string;
  password?: string | null;
  id: string;
  provider?: string | null;
  address?: string | null;
  postalcode?: number | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  categories: string[];
  materials: string;
  companyId: string;
};

export type Subscription = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
};

export type Company = {
  id: string;
  name: string;
  email: string;
  address: string;
  postalcode: number;
  bankType: string;
  bankAccount: string;
  nit: string;
  phone: string;
};

export type Item = {
  id: string;
  colors: string[];
  price: number;
  sizes: string[];
  quantity: number;
  productId: string;
};

export type ItemData = {
  itemId: string;
  productId: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  categories: string[];
  materials: string;
  companyId: string;
};

export type UserPurchase = {
  id: string;
  company: string;
  items: Item[];
  address: string;
  state: "pendiente" | "enviado" | "recibido";
  orderedAt: Timestamp;
};

export type CompanyOrder = {
  id: string;
  userId: string;
  items: Item[];
  address: string;
  state: "pendiente" | "enviado" | "recibido";
  orderedAt: Timestamp;
};
