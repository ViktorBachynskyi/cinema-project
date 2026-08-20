import { useGetTopRatedMoviesQuery } from "@/api/tmdbApi";
import type { Movie } from "@/api/tmdbTypes";
import { getImageUrl } from "@/api/tmdbConfig";
import { rating_star_svg } from "../SearchPage/constant";
import { useEffect, useState } from "react";

const MAX_MOVIES = 200;

const TopRatedMoviesPage = () => {
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState<Movie[]>([]);
    const {
        data,
        isLoading,
        isFetching,
        isError,
    } = useGetTopRatedMoviesQuery(page);

    const isInitialLoading = isLoading && movies.length === 0;
    const isLoadingMore = isFetching && page > 1;
    const canLoadMore =
        movies.length < MAX_MOVIES &&
        page < (data?.total_pages ?? 1) &&
        movies.length < (data?.total_results ?? 0);

    const handleLoadMore = () => {
        if (!canLoadMore || isLoadingMore) {
            return;
        }

        setPage((currentPage) => currentPage + 1);
    };

    useEffect(() => {
    if (!data?.results) {
        return;
    }

    setMovies((prev) => {
        const existingIds = new Set(prev.map((movie) => movie.id));
        const nextMovies = data.results.filter(
            (movie) => !existingIds.has(movie.id),
        );

        return [...prev, ...nextMovies].slice(0, MAX_MOVIES);
    });
    }, [data, page]);

    if (isInitialLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>Failed to load movies</div>;

    return (
        <div className="top-rated-movies">
            <h1>Top Rated Movies</h1>
            <div className="top-rated-movies__list">
                {movies.map((movie, index) => (
                    <div key={movie.id} className="top-rated-movies__movie">
                        <a href={`/movie/${movie.id}`}>
                            <img
                                src={getImageUrl(movie.poster_path, "w342")}
                                alt={movie.title}
                            />
                        </a>
                        <div className="top-rated-movies__movie-info">
                            <a
                                className="top-rated-movies__movie-title-container"
                                href={`/movie/${movie.id}`}
                            >
                                <span className="top-rated-movies__movie-number">
                                    {index + 1}.
                                </span>
                                <p className="top-rated-movies__movie-title">{movie.title}</p>
                            </a>
                            <div className="flex gap-2">
                                <span>{movie.release_date?.split("-")[0]}</span>
                                <span>|</span>
                                <div className="top-rated-movies__rating">
                                    {rating_star_svg}
                                    <span>{movie.vote_average.toFixed(1)}</span>
                                </div>
                            </div>
                            <p>{movie.overview}</p>
                        </div>
                    </div>
                ))}
            </div>

            {canLoadMore && (
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="top-rated-movies__load-more"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Loading..." : "Load more"}
                    </button>
                </div>

            )}
        </div>
    );
};

export default TopRatedMoviesPage;
