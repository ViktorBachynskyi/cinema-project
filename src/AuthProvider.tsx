import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth, db } from "./firebase";
import { setUser } from "./store/slices/authSlice";
import { doc, getDoc } from "firebase/firestore";

type UserProfile = {
  fullName?: string | null;
  displayName?: string | null;
  age?: number | null;
  favorites?: number[];
  favoriteGenres?: number[];
  watchList?: number[];
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userData: UserProfile = {};

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          userData = userDoc.exists() ? userDoc.data() : {};
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }

        const serializedUser = {
          uid: user.uid,
          email: user.email,
          fullName: userData.fullName ?? null,
          displayName: userData.displayName ?? user.displayName ?? null,
          age: userData.age ?? null,
          favorites: userData.favorites ?? [],
          favoriteGenres: userData.favoriteGenres ?? [],
          watchList: userData.watchList ?? [],
        };

        dispatch(setUser(serializedUser));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
