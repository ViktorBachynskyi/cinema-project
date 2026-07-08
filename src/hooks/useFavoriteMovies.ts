import { useGetMoviesByIdsQuery } from "@/api/tmdbApi";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { setFavoriteMovies } from "@/store/slices/authSlice";
import { matchesFavoriteIds } from "@/utils/favoriteMovies";
import { useEffect } from "react";

export const useFavoriteMovies = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const favoriteIds = user?.favorites ?? [];
  const cachedMovies = user?.favoriteMovies;

  const isCacheValid = matchesFavoriteIds(cachedMovies, favoriteIds);

  const shouldFetch = favoriteIds.length > 0 && !isCacheValid;

  const { data, isLoading, isFetching } = useGetMoviesByIdsQuery(
    favoriteIds,
    { skip: !shouldFetch },
  );

  useEffect(() => {
    if (data) {
      dispatch(setFavoriteMovies(data));
    }
  }, [data, dispatch]);

  const favoriteMovies =
    favoriteIds.length === 0
      ? []
      : isCacheValid
        ? cachedMovies ?? []
        : cachedMovies?.length
          ? cachedMovies
          : data ?? [];

  return {
    favoriteMovies,
    isLoading: shouldFetch && (isLoading || isFetching),
  };
};
