import { useGetGenresQuery, useGetTopRatedMoviesQuery, useGetTrendingMoviesQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import MovieCard from "@/components/MovieCard/MovieCard";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data: trendingMoviesWeek, isLoading: isTrendingMoviesWeekLoading, isError: isTrendingMoviesWeekError } = useGetTrendingMoviesQuery("week");
  const { data: trendingMoviesDay, isLoading: isTrendingMoviesDayLoading, isError: isTrendingMoviesDayError } = useGetTrendingMoviesQuery("day");
  const { data: topRatedMovies, isLoading: isTopRatedMoviesLoading, isError: isTopRatedMoviesError } = useGetTopRatedMoviesQuery();
  const { data: genres, isLoading: isGenresLoading, isError: isGenresError } = useGetGenresQuery();

  const trendingMovieToday = trendingMoviesDay?.results[0];

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  if (isTrendingMoviesWeekLoading || isTopRatedMoviesLoading) return <div>Loading...</div>;
  if (isTrendingMoviesWeekError || isTopRatedMoviesError) return <div>Failed to load movies</div>;

  console.log(trendingMovieToday);

  return (
    <div className="home">
      {trendingMovieToday && (
        <section className="home__trending-movie-today">
          <h2>Top Trending Today</h2>
          <div className="home__trending-movie-card">
            <a href={`/movie/${trendingMovieToday?.id}`} className="home__trending-movie-card__poster-container">
              <img
                className="home__trending-movie-card__poster"
                src={getImageUrl(trendingMovieToday?.poster_path ?? trendingMovieToday?.backdrop_path ?? null, "w780")}
                alt={trendingMovieToday?.title}
              />
            </a>
            <div className="home__trending-movie-card__info">
              <a href={`/movie/${trendingMovieToday?.id}`}>
                <h3 className="home__trending-movie-card__title">
                  {trendingMovieToday?.title} ({trendingMovieToday.release_date?.split("-")[0]})
                </h3>
              </a>
              {trendingMovieToday?.genre_ids && (
                <div className="home__trending-movie-card__genres">
                  {trendingMovieToday?.genre_ids.map((genreId) => (
                    <span key={genreId} className="home__trending-movie-card__genre">
                      {genres?.genres.find((genre) => genre.id === genreId)?.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="home__trending-movie-card__overview">{trendingMovieToday?.overview}</p>
              <p className="home__trending-movie-card__vote-average">{trendingMovieToday?.vote_average.toFixed(1)}/10</p>
            </div>
          </div>
        </section>
      )}

      {trendingMoviesWeek && trendingMoviesWeek?.results.length > 0 && (
        <section>
          <h2>Trending this week</h2>
          <div className="home__trending-movies-week__grid">
            {trendingMoviesWeek.results.slice(0, 18).map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                subtitle={`${movie.vote_average.toFixed(1)}/10`}
              />
            ))}
          </div>
        </section>
      )}

      {topRatedMovies && topRatedMovies?.results.length > 0 && (
        <section className="home__top-rated-movies">
          <div className="home__top-rated-movies__title-container">
            <h2>Top Rated Movies</h2>
            <Link to="/top-rated-movies">View All</Link>
          </div>
          <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container">
                {topRatedMovies.results.map((movie, index) => (
                  <div className="embla__slide" key={movie.id}>
                    <MovieCard
                      id={movie.id}
                      title={movie.title}
                      subtitle={`${movie.vote_average.toFixed(1)}/10`}
                      posterPath={movie.poster_path}
                      imageSize="w500"
                      fetchPriority="high"
                      noActionButtons={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
export default HomePage;
