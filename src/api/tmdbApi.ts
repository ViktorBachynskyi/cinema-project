import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { TMDB_BASE_URL, TMDB_API_KEY } from "./tmdbConfig";
import type { CollectionDetails, GenresResponse, Movie, MovieDetails, MoviesResponse } from "./tmdbTypes";
import type { Person } from "@/pages/PersonDetailsPage/PersonDetailsPage";
import {
  MAX_SOURCE_FAVORITES,
  pickPersonalizedRecommendations,
} from "@/utils/personalizedRecommendations";

export interface PersonalizedRecommendationsArgs {
  movieIds: number[];
  favoriteGenres: number[];
  excludeIds?: number[];
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL,
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
    getMovieWithDetails: builder.query<MovieDetails,{ id: string; params?: Record<string, any> }> ({
      query: ({ id, params = {} }) => {
        const defaultAppend = ["credits", "videos", "images", "reviews", "recommendations"];

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
    getPersonWithDetails: builder.query<Person,{ id: string; params?: Record<string, any> }>({
      query: ({ id, params = {} }) => {
        const defaultAppend = ["movie_credits", "images", "external_ids"];

        const extraAppend = params.append_to_response
          ? params.append_to_response.split(",")
          : [];

        const append_to_response = [...defaultAppend, ...extraAppend].join(",");

        return {
          url: `/person/${id}`,
          params: {
            api_key: TMDB_API_KEY,
            ...params,
            append_to_response,
          },
        };
      },
    }),
    searchMovies: builder.query<MoviesResponse, Record<string, any>>({
      query: (params) => ({
        url: `/search/movie`,
        params: {
          api_key: TMDB_API_KEY,
          ...params,
        },
      }),
    }),
    getGenres: builder.query<GenresResponse, void>({
      query: () => ({
        url: `/genre/movie/list`,
        params: { api_key: TMDB_API_KEY },
      }),
    }),
    getCountries: builder.query<{ iso_3166_1: string; english_name: string }[], void> ({
      query: () => ({
        url: `/configuration/countries`,
        params: { api_key: TMDB_API_KEY },
      }),
    }),
    getMoviesByIds: builder.query<Movie[], number[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        if (!ids.length) {
          return { data: [] };
        }

        const results = await Promise.all(
          ids.map((id) =>
            fetchWithBQ({
              url: `/movie/${id}`,
              params: { api_key: TMDB_API_KEY },
            }),
          ),
        );

        const movies: Movie[] = [];

        for (const result of results) {
          if (result.error) {
            return { error: result.error as FetchBaseQueryError };
          }

          movies.push(result.data as Movie);
        }

        return { data: movies };
      },
    }),
    getCollectionDetails: builder.query<CollectionDetails, number> ({
      query: (id: number ) => ({
        url: `/collection/${id}`,
        params: { api_key: TMDB_API_KEY },
      }),
    }),
    getTopRatedMovies: builder.query<MoviesResponse, number | void>({
      query: (page = 1) => ({
        url: `/movie/top_rated`,
        params: {
          api_key: TMDB_API_KEY,
          page,
        },
      }),
    }),
    getTrendingMovies: builder.query<MoviesResponse, "day" | "week">({
      query: (time_window: "day" | "week") => ({
        url: `/trending/movie/${time_window}`,
        params: { api_key: TMDB_API_KEY },
      }),
    }),
    getRecommendationsForFavoriteMovies: builder.query<Movie[], PersonalizedRecommendationsArgs>({
      async queryFn(
        { movieIds, favoriteGenres, excludeIds = [] },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) {
        if (!movieIds.length) {
          return { data: [] };
        }

        const sourceIds = movieIds.slice(0, MAX_SOURCE_FAVORITES);
        const results = await Promise.all(
          sourceIds.map((id) =>
            fetchWithBQ({
              url: `/movie/${id}/recommendations`,
              params: { api_key: TMDB_API_KEY, page: 1 },
            }),
          ),
        );

        const allRecommendations: Movie[] = [];

        for (const result of results) {
          if (result.error) {
            return { error: result.error as FetchBaseQueryError };
          }

          const response = result.data as MoviesResponse;
          allRecommendations.push(...response.results);
        }

        return {
          data: pickPersonalizedRecommendations(allRecommendations, {
            favoriteGenres,
            excludeIds: [...excludeIds, ...movieIds],
          }),
        };
      },
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieWithDetailsQuery,
  useGetPersonWithDetailsQuery,
  useSearchMoviesQuery,
  useGetGenresQuery,
  useGetCountriesQuery,
  useGetMoviesByIdsQuery,
  useGetCollectionDetailsQuery,
  useGetTopRatedMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetRecommendationsForFavoriteMoviesQuery,
} = tmdbApi;
