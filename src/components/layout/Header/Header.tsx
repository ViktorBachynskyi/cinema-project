import { useState, type FC } from "react";
import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";

const Header: FC<any> = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Sign out error:", err.message);
    }
  };

  const handleSearchIconClick = () => {

  }

  return (
    <header className="header">
      <div className="header__content">
        <div className="header__left-side">
          <div className="header__logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-7 w-7 text-text-link-hover"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
              <path d="M7 3v18"></path>
              <path d="M3 7.5h4"></path>
              <path d="M3 12h18"></path>
              <path d="M3 16.5h4"></path>
              <path d="M17 3v18"></path>
              <path d="M17 7.5h4"></path>
              <path d="M17 16.5h4"></path>
            </svg>
            <p className="">Cinema</p>
          </div>
          <nav className="header__navigation">
            <NavLink className="header__navigation-item" to="/">
              Home
            </NavLink>
            <NavLink className="header__navigation-item" to="search">
              Search
            </NavLink>
          </nav>
        </div>

        <div className="header__right-side">
          <button className="header__search-button" onClick={handleSearchIconClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="lucide lucide-search h-5 w-5"
            >
              <path d="m21 21-4.34-4.34"></path>
              <circle cx="11" cy="11" r="8"></circle>
            </svg>
          </button>
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
      </div>
    </header>
  );
};

export default Header;
