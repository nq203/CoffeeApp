import { Comment, ForumPost } from "@/app/Types/types";
import { db, collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, storage, query, orderBy } from "../firebaseConfig";
import { uploadImageFromUri } from "./storageService";
import { auth } from "../firebaseConfig";
import { arrayRemove, arrayUnion } from "firebase/firestore";

const forumPostCollection = collection(db, 'forum_posts');
export const getPostById = async (postId: string): Promise<ForumPost | null> => {
  try {
    const postDoc = await getDoc(doc(forumPostCollection, postId));
    if (postDoc.exists()) {
      return {
        id: postDoc.id,
        ...(postDoc.data() as Omit<ForumPost, 'id'>),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting post by ID:", error);
    return null;
  }
};

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
export const getFavoriteUserPost = async (postId: string): Promise<string[]> => {
  try {
    const postDoc = await getPostById(postId);
    if(!postDoc) {
      return [];
    }
    return postDoc.liked || [];
  } catch (error) {
    console.error("Error getting users who liked the post:", error);
    return [];
  }
};


export const toggleFavoritePost = async (postId: string, userId: string, liked: boolean) => {
  try {
    const postRef = doc(db, "forum_posts", postId);
    await updateDoc(postRef, {
      liked: liked ? arrayRemove(userId) : arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};