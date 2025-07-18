// lib/firebaseHelper.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase_dtb_config";
import { IProduct, IBanner } from "../dto";

export async function getProductsFromFirebase(): Promise<IProduct[]> {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = querySnapshot.docs.map((doc) => ({
    _id: doc.id,
    ...doc.data(),
  })) as IProduct[];

  return products;
}