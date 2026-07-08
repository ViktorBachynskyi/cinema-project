import { useGetTopRatedMoviesQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import MovieCard from "@/components/MovieCard/MovieCard";
import { rating_star_svg } from "../SearchPage/constant";

const TopRatedMoviesPage = () => {
    const { data, isLoading: isTopRatedMoviesLoading, isError: isTopRatedMoviesError } = useGetTopRatedMoviesQuery();

    if (isTopRatedMoviesLoading) return <div>Loading...</div>;
    if (isTopRatedMoviesError || !data) return <div>Failed to load movies</div>;

    return (
        <div className="top-rated-movies">
            <h1>Top Rated Movies</h1>
            <div className="top-rated-movies__list">
                {data?.results?.map((movie, index) => (
                    <div key={movie.id} className="top-rated-movies__movie">
                        <a href={`/movie/${movie.id}`}>
                            <img
                                src={getImageUrl(movie.poster_path, "w342")}
                                alt={movie.title}
                            />
                        </a>
                        <div className="top-rated-movies__movie-info">
                            <a className="top-rated-movies__movie-title-container" href={`/movie/${movie.id}`}>
                                <span className="top-rated-movies__movie-number">{index + 1}.</span>
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
        </div>
    )
}

export default TopRatedMoviesPage;