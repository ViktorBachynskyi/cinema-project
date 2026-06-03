import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthReady = useSelector((state: RootState) => state.auth.isAuthReady);

  return {
    user,
    isAuthenticated: !!user,
    isAuthReady,
  };
};
