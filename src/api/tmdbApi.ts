
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TMDB_BASE_URL, TMDB_API_KEY } from "./tmdbConfig";
import type { MoviesResponse } from "./tmdbTypes";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL
  }),
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, string | void>({
      query: (queryParams = "") => ({
        url: `/discover/movie${queryParams}`,
        params: {
          api_key: TMDB_API_KEY,
        },
      }),
    }),
  }),
});

export const { useGetMoviesQuery } = tmdbApi;