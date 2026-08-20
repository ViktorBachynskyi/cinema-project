import {
  useGetMoviesQuery,
  useGetRecommendationsForFavoriteMoviesQuery,
} from "@/api/tmdbApi";
import { useAuth } from "@/hooks/useAuth";
import { buildGenreRecommendationsParams } from "@/utils/personalizedRecommendations";
import { skipToken } from "@reduxjs/toolkit/query";

export const usePersonalizedRecommendations = () => {
  const { user } = useAuth();

  const favoriteIds = user?.favorites ?? [];
  const favoriteGenres = user?.favoriteGenres ?? [];
  const watchList = user?.watchList ?? [];
  const excludeIds = [...favoriteIds, ...watchList];

  const hasFavorites = favoriteIds.length > 0;
  const hasFavoriteGenres = favoriteGenres.length > 0;
  const canRecommend = hasFavorites || hasFavoriteGenres;

  const {
    data: recommendationsFromFavorites = [],
    isLoading: isFavoritesRecommendationsLoading,
    isFetching: isFavoritesRecommendationsFetching,
  } = useGetRecommendationsForFavoriteMoviesQuery(
    {
      movieIds: favoriteIds,
      favoriteGenres,
      excludeIds,
    },
    { skip: !hasFavorites },
  );

  const {
    data: recommendationsFromGenres,
    isLoading: isGenreRecommendationsLoading,
    isFetching: isGenreRecommendationsFetching,
  } = useGetMoviesQuery(
    hasFavoriteGenres && !hasFavorites
      ? buildGenreRecommendationsParams(favoriteGenres)
      : skipToken,
  );

  const recommendedMovies = hasFavorites
    ? recommendationsFromFavorites
    : (recommendationsFromGenres?.results ?? []);

  const isLoading = hasFavorites
    ? isFavoritesRecommendationsLoading || isFavoritesRecommendationsFetching
    : hasFavoriteGenres &&
      (isGenreRecommendationsLoading || isGenreRecommendationsFetching);

  return {
    recommendedMovies,
    isLoading,
    hasFavorites,
    hasFavoriteGenres,
    canRecommend,
  };
};
