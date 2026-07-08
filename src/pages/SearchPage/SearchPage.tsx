import {
  useGetCountriesQuery,
  useGetGenresQuery,
  useGetMoviesQuery,
  useSearchMoviesQuery,
} from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import { Divider } from "@/components/Divider";
import { skipToken } from "@reduxjs/toolkit/query";
import cn from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { rating_star_svg } from "./constant";
import {
  createDefaultFilters,
  DISCOVER_SORT_OPTIONS,
  type DiscoverSortBy,
  type MovieFilters,
} from "./types";
import {
  buildDiscoverParams,
  buildSearchParams,
  filterSearchResults,
  getActiveSortBy,
  getPaginationPages,
  isTitleSearchQuery,
} from "./utils";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() || "";

  const [filters, setFilters] = useState<MovieFilters>(() =>
    createDefaultFilters(urlQuery),
  );
  const [appliedFilters, setAppliedFilters] = useState<MovieFilters>(() =>
    createDefaultFilters(urlQuery),
  );

  const isTitleSearch = isTitleSearchQuery(appliedFilters.query);
  const activeSortBy = getActiveSortBy(appliedFilters);

  const { data: searchData, isLoading: isSearchLoading } = useSearchMoviesQuery(
    isTitleSearch ? buildSearchParams(appliedFilters) : skipToken,
  );
  const { data: discoverData, isLoading: isDiscoverLoading } =
    useGetMoviesQuery(
      isTitleSearch ? skipToken : buildDiscoverParams(appliedFilters),
    );
  const { data: countries } = useGetCountriesQuery();
  const { data: genresData } = useGetGenresQuery();

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
  const genres = genresData?.genres;
  const currentPage = appliedFilters.page || 1;
  const totalPages = data?.total_pages || 1;
  const pages = getPaginationPages(currentPage, totalPages);

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

  const updateFilter = <K extends keyof MovieFilters>(
    key: K,
    value: MovieFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const applySort = (sortBy: DiscoverSortBy) => {
    const nextPage = { sortBy, page: 1 } as const;

    setFilters((prev) => ({ ...prev, ...nextPage }));
    setAppliedFilters((prev) => ({ ...prev, ...nextPage }));
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
    const nextFilters = createDefaultFilters();

    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setSearchParams({});
  };

  const toggleGenre = (id: number) => {
    setFilters((prev) => {
      const current = prev.genre || [];
      const updated = current.includes(id)
        ? current.filter((genreId) => genreId !== id)
        : [...current, id];

      return {
        ...prev,
        genre: updated,
        page: 1,
      };
    });
  };

  const goToPage = (pageNumber: number) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));
    window.scrollTo(0, 0);
  };

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
                {genres.map((genre) => (
                  <label key={genre.id} className="search-page__filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.genre?.includes(genre.id) || false}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    {genre.name}
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

              {countries?.map((country) => (
                <option key={country.iso_3166_1} value={country.iso_3166_1}>
                  {country.english_name}
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

          {!isTitleSearch && (
            <>
              <Divider className="my-6!" />
              <div className="search-page__filters-block">
                <p className="search-page__filter-title">Sort by</p>
                <select
                  value={activeSortBy}
                  onChange={(e) => applySort(e.target.value as DiscoverSortBy)}
                >
                  {DISCOVER_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

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
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
                <p>{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="search-page__pagination pagination">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              className={cn("pagination__item", {
                isActive: pageNumber === currentPage,
              })}
              onClick={() => goToPage(pageNumber)}
              disabled={pageNumber === currentPage}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
