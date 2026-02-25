import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <Header />
      <main className="max-w-[1440px] px-4 sm:px-6 mx-auto">
        <Outlet />
      </main>
    </div>
  );
};