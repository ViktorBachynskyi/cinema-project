import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth, db } from "./firebase";
import { setUser } from "./store/slices/authSlice";
import { doc, getDoc } from "firebase/firestore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const serializedUser = {
          uid: user.uid,
          email: user.email,
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
