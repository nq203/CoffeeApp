import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useState, useEffect } from "react";

// 🟢 **Hook để kiểm tra user hiện tại**
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, loading };
};


// 🟢 **Đăng xuất User**
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
  }
};
