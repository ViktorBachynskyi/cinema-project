
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TMDB_BASE_URL, TMDB_API_KEY } from "./tmdbConfig";
import type { MovieDetails, MoviesResponse } from "./tmdbTypes";

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL
  }),
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, Record<string, any> | void>({
      query: (params = {}) => ({
        url: `/discover/movie`,
        params: {
          api_key: TMDB_API_KEY,
          ...params,
        },
      }),
    }),
    getMovieWithDetails: builder.query<MovieDetails,{ id: string; params?: Record<string, any> }>({
      query: ({ id, params = {} }) => {
        const defaultAppend = ["credits", "videos", "images"];

        const extraAppend = params.append_to_response
          ? params.append_to_response.split(",")
          : [];

        const append_to_response = [...defaultAppend, ...extraAppend].join(",");

        return {
          url: `/movie/${id}`,
          params: {
            api_key: TMDB_API_KEY,
            ...params,
            append_to_response,
          },
        };
      },
    }),
  }),
});

export const { useGetMoviesQuery, useGetMovieWithDetailsQuery } = tmdbApi;