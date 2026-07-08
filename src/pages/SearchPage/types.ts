export const DISCOVER_SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity" },
  { value: "primary_release_date.desc", label: "Year" },
  { value: "vote_average.desc", label: "Rating" },
] as const;

export type DiscoverSortBy = (typeof DISCOVER_SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT_BY: DiscoverSortBy = "popularity.desc";
export const DISCOVER_VOTE_COUNT_MIN = 100;
export const PAGINATION_WINDOW = 5;

export type MovieFilters = {
  page?: number;
  query?: string;
  genre?: number[];
  year?: number;
  country?: string;
  ratingMin?: number;
  ratingMax?: number;
  sortBy?: DiscoverSortBy;
};

export const createDefaultFilters = (query = ""): MovieFilters => ({
  page: 1,
  query: query.trim() || undefined,
  sortBy: DEFAULT_SORT_BY,
});
