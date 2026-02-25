export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (
  path: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
) => {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};