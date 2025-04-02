import { db, auth, collection, doc, setDoc, getDoc, updateDoc } from "../firebaseConfig";
import { User } from "@/app/Types/types";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { uploadImageFromUri } from "./storageService";

const userCollection = collection(db, "users");

// 🟢 **Tạo người dùng mới**
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser: User = {
      id: user.uid,
      username: email.split("@")[0],
      password: password,
      email: email,
      favorites: [],
      favorite_cafes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: email.split("@")[0],
      photoURL: ""
    };

    await setDoc(doc(userCollection, user.uid), newUser);
    return newUser;
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    throw error;
  }
};

// 🟢 **Đăng nhập tài khoản**
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return error;
    throw error;
    
  }
};

// 🟢 **Lấy thông tin người dùng**
export const getUser = async (userId: string) => {
  try {
    const userRef = doc(userCollection, userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      console.log("Người dùng không tồn tại!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin người dùng:", error);
    throw error;
  }
};
// 🟢 **Cập nhật thông tin người dùng**
export const updateUser = async (
  userId: string,
  updatedData: Partial<Omit<User, "id" | "created_at">> // Exclude `id` and `created_at` from updatable fields
) => {
  try {
    const userRef = doc(userCollection, userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("Người dùng không tồn tại!");
    }
    if(updatedData.photoURL){
      // storge image to storage
      // console.log("LOG :",updatedData.photoURL);
      const ImageURL = await uploadImageFromUri(updatedData.photoURL,'avatar-user');
      console.log(ImageURL);
      updatedData.photoURL = ImageURL;
    }
    // Prepare the updated data with a new `updated_at` timestamp
    const dataToUpdate = {
      ...updatedData,
      updated_at: new Date().toISOString(),
    };

    await updateDoc(userRef, dataToUpdate);
    console.log("Cập nhật thông tin người dùng thành công!");
    return { success: true, data: dataToUpdate };
  } catch (error) {
    console.error("Lỗi cập nhật thông tin người dùng:", error);
    throw error;
  }
};

// 🟢 **Thêm / Xóa quán cafe khỏi danh sách yêu thích**
export const toggleFavoriteCafe = async (userId: string, coffeeShopId: string) => {
  try {
    const userRef = doc(userCollection, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data() as User;
      const isFavorite = userData.favorite_cafes.includes(coffeeShopId);

      await updateDoc(userRef, {
        favorite_cafes: isFavorite ? arrayRemove(coffeeShopId) : arrayUnion(coffeeShopId),
        updated_at: new Date().toISOString(), // Cập nhật thời gian sửa đổi
      });

      return !isFavorite; // Trả về trạng thái mới
    }
  } catch (error) {
    console.error("Lỗi cập nhật danh sách yêu thích:", error);
    throw error;
  }
};
export const getFavoriteCafes = async (userId: string): Promise<string[]> => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return [];
  return userDoc.data().favorite_cafes || [];
};
