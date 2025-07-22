import { db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";

export async function saveUserToFirestore(uid: string, email: string, username: string) {
  const avatar = `https://api.dicebear.com/6.x/identicon/svg?seed=${username}`;
  await setDoc(doc(db, "users", uid), {
    email,
    username,
    avatar,
  });
}