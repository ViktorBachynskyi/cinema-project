import { db } from "@/firebase";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { setFavorites } from "@/store/slices/authSlice";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export const useFavorites = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  const favorites = user?.favorites ?? [];

  const isFavorite = (movieId: number) =>
    favorites.includes(movieId);

  const toggleFavorite = async (movieId: number) => {
    if (!isAuthenticated || !user) return;

    const isCurrentlyFavorite = favorites.includes(movieId);

    const updatedFavorites = isCurrentlyFavorite
      ? favorites.filter(id => id !== movieId)
      : [...favorites, movieId];

    dispatch(setFavorites(updatedFavorites));

    try {
      await updateDoc(doc(db, "users", user.uid), {
        favorites: updatedFavorites,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      dispatch(setFavorites(favorites));
      console.error("Failed to update favorites:", err);
    }
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    isAuthenticated,
  };
};
