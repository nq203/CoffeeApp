import { db, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, where } from "../firebaseConfig";
import { Comment } from "@/app/Types/types";

const commentPostCollection = collection(db, "comments");

// 📝 Thêm đánh giá mới
// export const addComment = async (comment: Comment) => {
//   try {
//     const docRef = await addDoc(reviewsCollection, { ...comment });
//     console.log("Comment được thêm với ID:", docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error("Lỗi khi thêm comment:", error);
//   }
// };
export const addComment = async (comment: Omit<Comment, 'id' >) => {
    try {
      const docRef = await addDoc(commentPostCollection, comment);
      console.log("Comment added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };
// 📌 Lấy danh sách đánh giá theo quán cafe
export const getCommentsByPostId = async (postId: string) => {
  try {
    const q = query(commentPostCollection, where("post_id", "==", postId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as Comment[];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    return [];
  }
};

// // ✏️ Cập nhật đánh giá
// export const updateReview = async (reviewId: string, data: Partial<Review>) => {
//   try {
//     const docRef = doc(db, "reviews", reviewId);
//     await updateDoc(docRef, data);
//     console.log("Cập nhật đánh giá thành công!");
//   } catch (error) {
//     console.error("Lỗi khi cập nhật đánh giá:", error);
//   }
// };

// // 🗑️ Xóa đánh giá
// export const deleteReview = async (reviewId: string) => {
//   try {
//     const docRef = doc(db, "reviews", reviewId);
//     await deleteDoc(docRef);
//     console.log("Xóa đánh giá thành công!");
//   } catch (error) {
//     console.error("Lỗi khi xóa đánh giá:", error);
//   }
// };
