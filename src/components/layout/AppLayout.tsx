import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import Header from "./Header/Header";
import BackButton from "./BackButton";
import { ErrorBoundary } from "../ErrorBoundary";

export const AppLayout = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="min-h-screen bg-bg-app text-zinc-100">
        <ScrollToTop />
        <Header />
        <main className="relative max-w-360 bg-bg-main p-4 sm:p-6 md:p-8 lg:p-10 mx-auto">
          <BackButton />
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};
