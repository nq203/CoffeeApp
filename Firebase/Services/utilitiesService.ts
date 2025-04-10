import { db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "../firebaseConfig";
import { Utilities } from "@/app/Types/types";

const utilitiesCollection = collection(db, "utilities");
export const getAllUtilities = async () => {
    const querySnapshot = await getDocs(utilitiesCollection);
    return querySnapshot.docs.map(doc =>({id: doc.id, ...doc.data()})) as unknown as Utilities[];
}