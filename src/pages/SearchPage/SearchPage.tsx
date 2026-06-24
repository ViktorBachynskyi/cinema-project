import {
  useGetCountriesQuery,
  useGetGenresQuery,
  useGetMoviesQuery,
  useSearchMoviesQuery,
} from "@/api/tmdbApi";
import type { Movie } from "@/api/tmdbTypes";
import { getImageUrl } from "@/api/tmdbConfig";
import { Divider } from "@/components/Divider";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import cn from "classnames";
import { rating_star_svg } from "./constant";

type MovieFilters = {
  page?: number;
  query?: string;
  genre?: number[];
  year?: number;
  country?: string;
  ratingMin?: number;
  ratingMax?: number;
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() || "";
  const [filters, setFilters] = useState<MovieFilters>({
    page: 1,
    query: urlQuery || undefined,
  });
  const [appliedFilters, setAppliedFilters] = useState<MovieFilters>({
    page: 1,
    query: urlQuery || undefined,
  });

  const buildDiscoverParams = (filters: MovieFilters) => {
    const base = {
      page: filters.page || 1,
    };

    return {
      ...base,
      with_genres: filters.genre?.join(","),
      primary_release_year: filters.year,
      with_origin_country: filters.country,
      "vote_average.gte": filters.ratingMin,
      "vote_average.lte": filters.ratingMax,
      "vote_count.gte": 100,
    };
  };

  const buildSearchParams = (filters: MovieFilters) => ({
    page: filters.page || 1,
    query: filters.query?.trim() || "",
    primary_release_year: filters.year,
  });

  const filterSearchResults = (movies: Movie[], filters: MovieFilters) => {
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
        matchesGenres &&
        matchesYear &&
        matchesRatingMin &&
        matchesRatingMax
      );
    });
  };

  const isTitleSearch = Boolean(appliedFilters.query?.trim());
  const discoverParams = buildDiscoverParams(appliedFilters);
  const movieSearchParams = buildSearchParams(appliedFilters);

  const { data: searchData, isLoading: isSearchLoading } = useSearchMoviesQuery(
    isTitleSearch ? movieSearchParams : skipToken,
  );
  const { data: discoverData, isLoading: isDiscoverLoading } =
    useGetMoviesQuery(isTitleSearch ? skipToken : discoverParams);

  const data = useMemo(() => {
    if (!isTitleSearch) return discoverData;
    if (!searchData) return searchData;

    const filteredResults = filterSearchResults(
      searchData.results,
      appliedFilters,
    );

    return {
      ...searchData,
      results: filteredResults,
      total_results: filteredResults.length,
    };
  }, [appliedFilters, discoverData, isTitleSearch, searchData]);

  const isLoading = isTitleSearch ? isSearchLoading : isDiscoverLoading;

  const { data: countries } = useGetCountriesQuery();
  const { data: genresData } = useGetGenresQuery();

  const genres = genresData?.genres;

  const currentPage = appliedFilters.page || 1;
  const totalPages = data?.total_pages || 1;

  const pages = Array.from({ length: 5 }, (_, i) => {
    return Math.max(1, currentPage - 2) + i;
  }).filter((page) => page <= totalPages);

  const updateFilter = (key: keyof MovieFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const applyFilters = () => {
    const nextFilters = {
      ...filters,
      page: 1,
    };
    const trimmedQuery = nextFilters.query?.trim() || "";

    setAppliedFilters(nextFilters);
    setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      query: undefined,
    });
    setAppliedFilters({
      page: 1,
      query: undefined,
    });

    setSearchParams({});
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: urlQuery || undefined,
      page: 1,
    }));
    setAppliedFilters((prev) => ({
      ...prev,
      query: urlQuery || undefined,
      page: 1,
    }));
  }, [urlQuery]);

  const toggleGenre = (id: number) => {
    setFilters((prev) => {
      const current = prev.genre || [];

      const updated = current.includes(id)
        ? current.filter((g) => g !== id)
        : [...current, id];

      return {
        ...prev,
        genre: updated,
        page: 1,
      };
    });
  };

  console.log(data);

  return (
    <div className="search-page">
      <h1>Search Movies</h1>

      <div className="search-page__search">
        <input
          className="search-page__search-input"
          placeholder="Search movies by title…"
          name="search"
          type="text"
          value={filters.query || ""}
          onChange={(e) => updateFilter("query", e.target.value)}
        />

        <button
          className="search-page__search-button"
          onClick={applyFilters}
        >
          Search
        </button>
      </div>

      <Divider />

      {isLoading && <p>Loading...</p>}

      <div className="search-page__results-n-filters">
        <div className="search-page__filters">
          <h2>Filters</h2>
          <Divider className="mt-0! mb-6!" />
          {genres && (
            <div className="search-page__filters-block">
              <p className="search-page__filter-title">Genre</p>

              <div className="search-page__filter-genres">
                {genres.map((g) => (
                  <label key={g.id} className="search-page__filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.genre?.includes(g.id) || false}
                      onChange={() => toggleGenre(g.id)}
                    />
                    {g.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <Divider className="my-6!" />
          <div className="search-page__filters-block">
            <p className="search-page__filter-title">Country</p>
            <select
              value={filters.country || ""}
              onChange={(e) => updateFilter("country", e.target.value)}
            >
              <option value="">All Countries</option>

              {countries?.map((c) => (
                <option key={c.iso_3166_1} value={c.iso_3166_1}>
                  {c.english_name}
                </option>
              ))}
            </select>
          </div>
          <Divider className="my-6!" />
          <div className="search-page__filters-block">
            <p className="search-page__filter-title">Ratings</p>

            <div className="search-page__filter-range">
              <input
                type="number"
                min={0}
                max={10}
                placeholder="Min"
                value={filters.ratingMin ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "ratingMin",
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
              <span>to</span>
              <input
                type="number"
                min={0}
                max={10}
                placeholder="Max"
                value={filters.ratingMax ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "ratingMax",
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />
            </div>
          </div>
          <Divider className="my-6!" />
          <button
            className="search-page__filters-apply-btn mb-4"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
          <button
            className="search-page__filters-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
        <div className="search-page__movies-list">
          {data?.results?.map((movie) => (
            <div key={movie.id} className="search-page__movie">
              <a href={`/movie/${movie.id}`}>
                <img
                  src={getImageUrl(movie.poster_path, "w342")}
                  alt={movie.title}
                />
              </a>
              <div className="search-page__movie-info">
                <a href={`/movie/${movie.id}`}>
                  <p className="search-page__movie-title">{movie.title}</p>
                </a>
                <div className="flex gap-2">
                  <span>{movie.release_date?.split("-")[0]}</span>
                  <span>|</span>
                  <div className="search-page__rating">
                    {rating_star_svg}
                    <span className="">{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <p>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="search-page__pagination pagination">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            className={cn("pagination__item", {
              isActive: pageNumber === currentPage,
            })}
            onClick={() =>
              setAppliedFilters((prev) => ({
                ...prev,
                page: pageNumber,
              }))
            }
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
