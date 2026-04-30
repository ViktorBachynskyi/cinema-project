import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { lazy, Suspense } from "react";


const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage/SearchPage"));
const SignIn = lazy(() => import("@/pages/SignIn/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp/SignUp"));
const MovieDetailsPage = lazy(
  () => import("@/pages/MovieDetailsPage/MovieDetailsPage"),
);
const PersonDetailsPage = lazy(
  () => import("@/pages/PersonDetailsPage/PersonDetailsPage"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "movie/:id",
        element: <MovieDetailsPage />,
      },
      {
        path: "cast/:id",
        element: <PersonDetailsPage />,
      },
      {
        path: "favorites",
        element: (
          <ProtectedRoute>
            <div>Favorites page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
