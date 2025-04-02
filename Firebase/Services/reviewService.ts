import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "../firebaseConfig";
import { Review } from "@/app/Types/types";

const reviewsCollection = collection(db, "reviews");

// 📝 Thêm đánh giá mới
export const addReview = async (shopId: string, review: Review) => {
  try {
    const docRef = await addDoc(reviewsCollection, { ...review, shopId });
    console.log("Đánh giá được thêm với ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Lỗi khi thêm đánh giá:", error);
  }
};

// 📌 Lấy danh sách đánh giá theo quán cafe
export const getReviewsByShopId = async (shopId: string) => {
  try {
    const q = query(reviewsCollection, where("shopId", "==", shopId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Review[];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};

// ✏️ Cập nhật đánh giá
export const updateReview = async (reviewId: string, data: Partial<Review>) => {
  try {
    const docRef = doc(db, "reviews", reviewId);
    await updateDoc(docRef, data);
    console.log("Cập nhật đánh giá thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật đánh giá:", error);
  }
};

// 🗑️ Xóa đánh giá
export const deleteReview = async (reviewId: string) => {
  try {
    const docRef = doc(db, "reviews", reviewId);
    await deleteDoc(docRef);
    console.log("Xóa đánh giá thành công!");
  } catch (error) {
    console.error("Lỗi khi xóa đánh giá:", error);
  }
};
