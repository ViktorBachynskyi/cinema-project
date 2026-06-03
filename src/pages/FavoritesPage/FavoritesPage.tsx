import { getImageUrl } from "@/api/tmdbConfig";
import { useFavoriteMovies } from "@/hooks/useFavoriteMovies";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const { favoriteMovies, isLoading } = useFavoriteMovies();

  return (
    <div className="favorites-page">
      <h1>Favorite movies</h1>

      {isLoading && <p>Loading favorites...</p>}

      {!isLoading && !favoriteMovies.length && (
        <p className="favorites-page__empty">
          You have not added any favorites yet.
        </p>
      )}

      {!isLoading && favoriteMovies.length > 0 && (
        <div className="favorites-page__grid">
          {favoriteMovies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="favorites-page__card"
            >
              <img
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
              />
              <div className="favorites-page__card-title">{movie.title}</div>
              <div className="favorites-page__card-rating">
                {movie.vote_average.toFixed(1)}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
