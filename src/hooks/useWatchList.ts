import { db } from "@/firebase";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { setWatchList } from "@/store/slices/authSlice";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export const useWatchList = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  const watchList = user?.watchList ?? [];

  const isInWatchList = (movieId: number) => watchList.includes(movieId);

  const toggleWatchList = async (movieId: number) => {
    if (!isAuthenticated || !user) return;

    const isCurrentlyInWatchList = watchList.includes(movieId);

    const updatedWatchList = isCurrentlyInWatchList
      ? watchList.filter((id) => id !== movieId)
      : [...watchList, movieId];

    dispatch(setWatchList(updatedWatchList));

    try {
      await updateDoc(doc(db, "users", user.uid), {
        watchList: updatedWatchList,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      dispatch(setWatchList(watchList));
      console.error("Failed to update watch list:", err);
    }
  };

  return {
    watchList,
    isInWatchList,
    toggleWatchList,
    isAuthenticated,
  };
};
