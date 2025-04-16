import { Comment, ForumPost } from "@/app/Types/types";
import { db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, storage, query, orderBy } from "../firebaseConfig";
import { uploadImageFromUri } from "./storageService";
import { auth } from "../firebaseConfig";

const forumPostCollection = collection(db, 'forum_posts');

export const createForumPost = async (forum: Omit<ForumPost, 'id' | 'created_at'>) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User must be authenticated to create a post');
    }

    // Upload images first
    const imagesURL = [];
    for (const image of forum.images) {
      try {
        const imageURL = await uploadImageFromUri(image, 'forum-post');
        console.log("Uploaded image URL:", imageURL);
        imagesURL.push(imageURL);
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
      }
    }

    // Create post with uploaded image URLs
    const postData: Omit<ForumPost, 'id'> = {
      ...forum,
      user: currentUser.uid,
      images: imagesURL,
      created_at: new Date().toISOString(),
    };

    const docRef = await addDoc(forumPostCollection, postData);
    console.log("Forum post created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating forum post:", error);
    throw error;
  }
};

export const getAllForumPosts = async (): Promise<ForumPost[]> => {
  try {
    const q = query(forumPostCollection, orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);

    const posts: ForumPost[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ForumPost, 'id'>),
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching forum posts:", error);
    return [];
  }
};

