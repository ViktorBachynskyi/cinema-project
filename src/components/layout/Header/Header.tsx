import type { FC } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";

const Header: FC<any> = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Sign out error:", err.message);
    }
  };

  return (
    <header className="header h-15 flex justify-around items-center bg-bg-header-footer mb-12">
      <nav className="header__navigation">
        <NavLink className="header__navigation-item" to="/">
          Home
        </NavLink>
        <NavLink className="header__navigation-item" to="search">
          Search
        </NavLink>
      </nav>
      <NavLink to="/" className="header__navigation-item logo">
        Cinema
      </NavLink>
      <div>
        {isAuthenticated ? (
          <button className="header__navigation-item" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <NavLink className="header__navigation-item" to="/signin">
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
