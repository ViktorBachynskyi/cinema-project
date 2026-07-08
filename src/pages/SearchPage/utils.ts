import type { Movie } from "@/api/tmdbTypes";
import {
  DEFAULT_SORT_BY,
  DISCOVER_VOTE_COUNT_MIN,
  PAGINATION_WINDOW,
  type MovieFilters,
} from "./types";

export const isTitleSearchQuery = (query?: string) => Boolean(query?.trim());

export const buildDiscoverParams = (filters: MovieFilters) => ({
  page: filters.page || 1,
  sort_by: filters.sortBy ?? DEFAULT_SORT_BY,
  with_genres: filters.genre?.join(","),
  primary_release_year: filters.year,
  with_origin_country: filters.country,
  "vote_average.gte": filters.ratingMin,
  "vote_average.lte": filters.ratingMax,
  "vote_count.gte": DISCOVER_VOTE_COUNT_MIN,
});

export const buildSearchParams = (filters: MovieFilters) => ({
  page: filters.page || 1,
  query: filters.query?.trim() || "",
  primary_release_year: filters.year,
});

export const filterSearchResults = (
  movies: Movie[],
  filters: MovieFilters,
) => {
  return movies.filter((movie) => {
    const matchesGenres =
      !filters.genre?.length ||
      filters.genre.every((genreId) => movie.genre_ids?.includes(genreId));
    const matchesYear =
      !filters.year || movie.release_date?.startsWith(String(filters.year));
    const matchesRatingMin =
      filters.ratingMin === undefined ||
      movie.vote_average >= filters.ratingMin;
    const matchesRatingMax =
      filters.ratingMax === undefined ||
      movie.vote_average <= filters.ratingMax;

    return (
      matchesGenres && matchesYear && matchesRatingMin && matchesRatingMax
    );
  });
};

export const getPaginationPages = (
  currentPage: number,
  totalPages: number,
  windowSize = PAGINATION_WINDOW,
) => {
  return Array.from({ length: windowSize }, (_, i) => {
    return Math.max(1, currentPage - 2) + i;
  }).filter((page) => page <= totalPages);
};

export const getActiveSortBy = (filters: MovieFilters) =>
  filters.sortBy ?? DEFAULT_SORT_BY;
