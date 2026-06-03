import type { Movie } from "@/api/tmdbTypes";

export const matchesFavoriteIds = (
  movies: Movie[] | null | undefined,
  ids: number[],
) => {
  if (ids.length === 0) return true;
  if (!movies || movies.length !== ids.length) return false;

  const idsSet = new Set(ids);

  return movies.every((movie) => idsSet.has(movie.id));
};
