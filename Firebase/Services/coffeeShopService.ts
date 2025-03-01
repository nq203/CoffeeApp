import { db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "../firebaseConfig";
import { CoffeeShop } from "@/app/Types/types";

const coffeeShopCollection = collection(db, "coffeeShops");

// Thêm quán cafe mới
export const addCoffeeShop = async (coffeeShop: CoffeeShop) => {
  try {
    const docRef = await addDoc(coffeeShopCollection, coffeeShop);
    console.log("Quán cafe được thêm với ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi thêm quán cafe:", error);
  }
};

// Lấy danh sách tất cả quán cafe
export const getAllCoffeeShops = async () => {
  const querySnapshot = await getDocs(coffeeShopCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as CoffeeShop[];
};

// Lấy thông tin quán cafe theo ID
export const getCoffeeShopById = async (id: string) => {
  const docRef = doc(db, "coffeeShops", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as unknown as CoffeeShop) : null;
};
export const getListCoffeeShopById = async (ids: string[]): Promise<CoffeeShop[]> => {
  const promises = ids.map(id => getCoffeeShopById(id));
  const results = await Promise.all(promises);
  
  // Lọc ra những quán cafe hợp lệ (không null)
  return results.filter(shop => shop !== null) as CoffeeShop[];
};
// Cập nhật quán cafe
export const updateCoffeeShop = async (id: string, data: Partial<CoffeeShop>) => {
  const docRef = doc(db, "coffeeShops", id);
  await updateDoc(docRef, data);
};

// Xóa quán cafe
export const deleteCoffeeShop = async (id: string) => {
  const docRef = doc(db, "coffeeShops", id);
  await deleteDoc(docRef);
};
