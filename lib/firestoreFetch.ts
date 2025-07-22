import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { IProduct, IBanner } from "../dto";

export async function fetchProducts(): Promise<IProduct[]> {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as IProduct));
}

export async function fetchBanners(): Promise<IBanner[]> {
  const querySnapshot = await getDocs(collection(db, "banners"));
  return querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as IBanner));
}

export async function fetchProductById(id: string): Promise<IProduct | null> {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { _id: docSnap.id, ...docSnap.data() } as IProduct;
  }
  return null;
}