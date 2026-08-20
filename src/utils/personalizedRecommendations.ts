import type { Movie } from "@/api/tmdbTypes";
import { DEFAULT_SORT_BY, DISCOVER_VOTE_COUNT_MIN } from "@/pages/SearchPage/types";

export const MAX_SOURCE_FAVORITES = 5;
export const RECOMMENDATIONS_LIMIT = 20;

export const buildGenreRecommendationsParams = (genreIds: number[]) => ({
  page: 1,
  sort_by: DEFAULT_SORT_BY,
  with_genres: genreIds.join("|"),
  "vote_count.gte": DISCOVER_VOTE_COUNT_MIN,
});

export const movieMatchesFavoriteGenres = (
  movie: Movie,
  favoriteGenres: number[],
) => {
  if (!favoriteGenres.length) {
    return true;
  }

  if (!movie.genre_ids?.length) {
    return false;
  }

  return movie.genre_ids.some((genreId) => favoriteGenres.includes(genreId));
};

export const pickPersonalizedRecommendations = (
  movies: Movie[],
  {
    favoriteGenres,
    excludeIds = [],
    limit = RECOMMENDATIONS_LIMIT,
  }: {
    favoriteGenres: number[];
    excludeIds?: number[];
    limit?: number;
  },
) => {
  const excludeSet = new Set(excludeIds);
  const seen = new Set<number>();

  const filtered = movies.filter((movie) => {
    if (excludeSet.has(movie.id) || seen.has(movie.id)) {
      return false;
    }

    if (!movieMatchesFavoriteGenres(movie, favoriteGenres)) {
      return false;
    }

    seen.add(movie.id);
    return true;
  });

  return filtered
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, limit);
};
