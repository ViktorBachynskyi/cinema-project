import { getImageUrl } from "@/api/tmdbConfig";
import { useFavorites } from "@/hooks/useFavorites";
import { useWatchList } from "@/hooks/useWatchList";
import cn from "classnames";
import type { ImgHTMLAttributes, MouseEvent } from "react";
import { Link } from "react-router-dom";

const DEFAULT_POSTER =
  "https://s3-eu-west-1.amazonaws.com/entertainmentie/uploads/2021/08/27144852/generic-movie-poster.jpg";

type MovieCardProps = {
  id: number;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  subtitle?: string;
  imageSize?: "w185" | "w342" | "w500" | "w780" | "original";
  variant?: "default" | "poster";
  className?: string;
  fetchPriority?: ImgHTMLAttributes<HTMLImageElement>["fetchPriority"];
  noActionButtons?: boolean;
};

const MovieCard = ({
  id,
  title,
  posterPath,
  backdropPath,
  subtitle,
  imageSize = "w500",
  variant = "default",
  className,
  fetchPriority,
  noActionButtons = false,
}: MovieCardProps) => {
  const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
  const { isInWatchList, toggleWatchList } = useWatchList();
  const isPosterOnly = variant === "poster";

  const posterSrc =
    getImageUrl(posterPath ?? backdropPath ?? null, imageSize) ||
    DEFAULT_POSTER;

  const handleFavoriteClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(id);
  };

  const handleWatchListClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWatchList(id);
  };

  const favorite = isFavorite(id);
  const inWatchList = isInWatchList(id);

  const poster = (
    <img
      className="movie-card__poster"
      src={posterSrc}
      alt={title}
      fetchPriority={fetchPriority}
    />
  );

  return (
    <div className={cn("movie-card", { "movie-card--poster": isPosterOnly }, className)}>
      <div className="movie-card__poster-container">
        {isPosterOnly ? poster : <Link to={`/movie/${id}`}>{poster}</Link>}

        {isAuthenticated && !noActionButtons && (
          <div className="movie-card__buttons">
            <button
              type="button"
              className={cn("movie-card__add-to-favorites", {
                isActive: favorite,
              })}
              title={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              onClick={handleFavoriteClick}
            >
              <span className="material-symbols-sharp material-symbols">
                favorite
              </span>
            </button>
            <button
              type="button"
              className={cn("movie-card__add-to-watchlist", {
                isActive: inWatchList,
              })}
              title={
                inWatchList ? "Remove from watch list" : "Add to watch list"
              }
              aria-label={
                inWatchList ? "Remove from watch list" : "Add to watch list"
              }
              onClick={handleWatchListClick}
            >
              <span className="material-symbols-sharp material-symbols">
                {inWatchList ? "check" : "add"}
              </span>
            </button>
          </div>
        )}
      </div>

      {!isPosterOnly && (
        <Link to={`/movie/${id}`} className="movie-card__info">
          <p className="movie-card__title">{title}</p>
          {subtitle && <p className="movie-card__subtitle">{subtitle}</p>}
        </Link>
      )}
    </div>
  );
};

export default MovieCard;
