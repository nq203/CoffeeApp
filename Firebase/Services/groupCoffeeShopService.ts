import { db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc } from "../firebaseConfig";
import { GroupOfCoffeeShop } from "@/app/Types/types";

const groupCollection = collection(db, "groups_of_coffeeshops");

// Thêm nhóm quán cafe mới
export const addGroupOfCoffeeShop = async (group: GroupOfCoffeeShop) => {
  try {
    const docRef = await addDoc(groupCollection, group);
    console.log("Nhóm quán cafe được thêm với ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi thêm nhóm quán cafe:", error);
  }
};

// Lấy danh sách tất cả nhóm quán cafe
export const getAllGroupsOfCoffeeShops = async () => {
  const querySnapshot = await getDocs(groupCollection);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as GroupOfCoffeeShop[];
};

// Lấy thông tin nhóm quán cafe theo ID
export const getGroupOfCoffeeShopById = async (id: string) => {
  const docRef = doc(db, "groups_of_coffeeshops", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as unknown as GroupOfCoffeeShop) : null;
};

// Lấy danh sách nhóm quán cafe theo danh sách ID
export const getListGroupsOfCoffeeShopsById = async (ids: string[]): Promise<GroupOfCoffeeShop[]> => {
  const promises = ids.map(id => getGroupOfCoffeeShopById(id));
  const results = await Promise.all(promises);
  return results.filter(group => group !== null) as GroupOfCoffeeShop[];
};

// Cập nhật nhóm quán cafe
export const updateGroupOfCoffeeShop = async (id: string, data: Partial<GroupOfCoffeeShop>) => {
  const docRef = doc(db, "groups_of_coffeeshops", id);
  await updateDoc(docRef, data);
};

// Xóa nhóm quán cafe
export const deleteGroupOfCoffeeShop = async (id: string) => {
  const docRef = doc(db, "groups_of_coffeeshops", id);
  await deleteDoc(docRef);
};
