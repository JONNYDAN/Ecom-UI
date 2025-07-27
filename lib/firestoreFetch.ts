import { db } from "./firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { IProduct, IBanner } from "../dto";



export async function fetchProducts(): Promise<IProduct[]> {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as IProduct));
}

export async function fetchBanners(): Promise<IBanner[]> {
  const querySnapshot = await getDocs(collection(db, "banners"));
  return querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() } as IBanner));
}

export async function fetchProductBySlug(slug: string): Promise<IProduct | null> {
  try {
    const q = query(
      collection(db, "products"),
      where("slug.current", "==", slug)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Get the first matching document
      const docSnap = querySnapshot.docs[0];
      return { _id: docSnap.id, ...docSnap.data() } as IProduct;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}