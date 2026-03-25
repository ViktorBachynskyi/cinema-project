import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-bg-app text-zinc-100">
      <Header />
      <main className="max-w-360 bg-bg-main p-4 sm:p-6 md:p-8 lg:p-10 mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
