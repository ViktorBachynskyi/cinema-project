import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";

const Header: FC<any> = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleOutsideClick = (e: PointerEvent) => {
      if (searchRef.current?.contains(e.target as Node)) {
        return;
      }

      setIsSearchOpen(false);
      setQuery("");
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Sign out error:", err.message);
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    setQuery("");
    setIsSearchOpen(false);
  };

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
            {isAuthenticated && (
              <NavLink className="header__navigation-item" to="/favorites">
                Favorites
              </NavLink>
            )}
          </nav>
        </div>

        <div className="header__right-side">
          <form
            ref={searchRef}
            className={`header__search ${isSearchOpen ? "isOpen" : ""}`}
            onSubmit={handleSearchSubmit}
          >
            <input
              ref={searchInputRef}
              name="search-input"
              className="header__search-input"
              type="text"
              value={query}
              placeholder="Search movies..."
              aria-label="Search movies"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="header__search-button"
              type="submit"
              aria-label="Search movies"
            >
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
          </form>
          {isAuthenticated ? (
            <>
              <NavLink className="header__navigation-item" to="/user">
                Profile
              </NavLink>
              <button
                className="header__navigation-item"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
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
