import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("@/pages/HomePage/HomePage"));
const SearchPage = lazy(() => import("@/pages/SearchPage/SearchPage"));
const SignIn = lazy(() => import("@/pages/SignIn/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp/SignUp"));
const UserPage = lazy(() => import("@/pages/UserPage/UserPage"));
const FavoritesPage = lazy(() => import("@/pages/FavoritesPage/FavoritesPage"));
const MovieDetailsPage = lazy(
  () => import("@/pages/MovieDetailsPage/MovieDetailsPage"),
);
const PersonDetailsPage = lazy(
  () => import("@/pages/PersonDetailsPage/PersonDetailsPage"),
);
const TopRatedMoviesPage = lazy(() => import("@/pages/TopRatedMovies/TopRatedMovies"));

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
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
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
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "top-rated-movies",
        element: <TopRatedMoviesPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
