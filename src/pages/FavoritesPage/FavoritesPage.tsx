import type { Movie } from "@/api/tmdbTypes";
import MovieCard from "@/components/MovieCard/MovieCard";
import { useFavoriteMovies } from "@/hooks/useFavoriteMovies";
import { useEffect, useRef, useState } from "react";

const FavoritesPage = () => {
  const { favoriteMovies, isLoading } = useFavoriteMovies();
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    setDisplayMovies((prev) => {
      if (!isInitialized.current) {
        isInitialized.current = true;
        return favoriteMovies;
      }

      const displayedIds = new Set(prev.map((movie) => movie.id));
      const newMovies = favoriteMovies.filter(
        (movie) => !displayedIds.has(movie.id),
      );

      if (newMovies.length === 0) {
        return prev;
      }

      return [...prev, ...newMovies];
    });
  }, [favoriteMovies, isLoading]);

  const showInitialLoading = isLoading && !isInitialized.current;

  return (
    <div className="favorites-page">
      <h1>Favorite movies</h1>

      {showInitialLoading && <p>Loading favorites...</p>}

      {!showInitialLoading && displayMovies.length === 0 && (
        <p className="favorites-page__empty">
          You have not added any favorites yet.
        </p>
      )}

      {displayMovies.length > 0 && (
        <div className="movie-card-grid">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              subtitle={`${movie.vote_average.toFixed(1)}/10`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
