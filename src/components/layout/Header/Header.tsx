import type { FC } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import "./Header.scss";
import { signOut, type User } from "firebase/auth";
import { auth } from "@/firebase";
import { setUser } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";

const Header: FC<any> = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
 
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(setUser(null));
        } catch (err: any) {
            console.error("Sign out error:", err.message);
        }
    };
    
    return (
        <header className="header h-[60px] flex justify-around items-center bg-slate-800 mb-10">
            <nav className="flex gap-4">
                <NavLink to="/">Home</NavLink>
                <NavLink to="search">Search</NavLink>
            </nav>
            <p className="text-3xl font-bold italic">Cinema</p>
            {isAuthenticated && (
                <div>
                    <button onClick={handleSignOut}>sign out</button>
                </div>
            )}
            {!isAuthenticated && (
                <div>
                    <NavLink to="/signin">Sign In</NavLink>
                </div>
            )}
        </header>
    )
};

export default Header;

