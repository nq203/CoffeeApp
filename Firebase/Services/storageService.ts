import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { auth } from "../firebaseConfig";

/**
 * Converts an image URI to a Blob.
 * @param uri - The URI of the image.
 * @returns A promise that resolves to a Blob object.
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error("Failed to fetch the file from URI.");
  }
  return await response.blob();
};

/**
 * Uploads an image from a URI to Firebase Storage.
 * @param uri - The URI of the image to be uploaded.
 * @param folderPath - The folder path in Firebase Storage where the file will be stored.
 * @returns A promise that resolves with the download URL of the uploaded file.
 */
export const uploadImageFromUri = async (uri: string, folderPath: string): Promise<string> => {
  try {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to upload images");
    }

    const blob = await uriToBlob(uri);
    const fileName = `${new Date().getTime()}-${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, `${folderPath}/${fileName}`);
    
    // Set content type for the upload
    const metadata = {
      contentType: 'image/jpeg',
    };

    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Failed to upload image from URI:", error);
    throw error;
  }
};

/**
 * Downloads a file's URL from Firebase Storage.
 * @param filePath - The file path in Firebase Storage.
 * @returns A promise that resolves with the download URL.
 */
export const getFileURL = (filePath: string): Promise<string> => {
  return getDownloadURL(ref(storage, filePath));
};

/**
 * Deletes a file from Firebase Storage.
 * @param filePath - The file path in Firebase Storage.
 * @returns A promise that resolves when the file is deleted.
 */
export const deleteFile = (filePath: string): Promise<void> => {
  const fileRef = ref(storage, filePath);
  return deleteObject(fileRef);
};
