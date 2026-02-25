import type { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    user,
    isAuthenticated: !!user
  };
};