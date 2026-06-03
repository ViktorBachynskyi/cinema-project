import { useGetMovieWithDetailsQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import { Divider } from "@/components/Divider";
import { useFavorites } from "@/hooks/useFavorites";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import { Link, useParams } from "react-router-dom";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const {
    data: movie,
    isLoading,
    isError,
  } = useGetMovieWithDetailsQuery({
    id: id!,
  });
  const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();
  const director = movie?.credits?.crew.find(
    (crewMember) => crewMember.job === "Director",
  );
  const backdrops = (movie?.images?.backdrops ?? []).filter((img) => {
    return img.width >= 2100 && img.width / img.height >= 1.5;
  });
  const sortedBySize = backdrops.sort(
    (a, b) => b.width * b.height - a.width * a.height,
  );
  const previewImages = sortedBySize.slice(0, 9);
  const trailer = movie?.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube",
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError || !movie) return <div>Failed to load movie</div>;

  console.log(movie);

  return (
    <section className="movie-details">
      <h1>{movie.title}</h1>

      <div className="movie-details__main-info">
        <div className="movie-details__poster-container relative">
          <img
            className="movie-details__poster w-[342px]"
            src={getImageUrl(movie.poster_path, "w342")}
            alt={movie.title}
            fetchPriority="high"
          />
          {isAuthenticated && (
            <button
              type="button"
              className={cn("movie-details__favorite-button", {
                isFavorite: isFavorite(movie.id),
              })}
              aria-label={
                isFavorite(movie.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              onClick={() =>
                toggleFavorite(movie.id)
              }
            >
              <span className="material-symbols-sharp material-symbols">
                favorite
              </span>
            </button>
          )}
        </div>

        <div className="movie-details__info">
          <p>{movie.overview}</p>
          <Divider />
          <p className="movie-details__info-item">
            <span>Year:</span>
            <span>
              {movie.release_date
                ? new Date(movie.release_date).getFullYear()
                : "—"}
            </span>
          </p>
          <p className="movie-details__info-item">
            <span>Country:</span>
            <span>
              {movie.origin_country.map((country) => country).join(", ")}
            </span>
          </p>
          <p className="movie-details__info-item">
            <span>Genres:</span>
            <span>{movie.genres.map((g) => g.name).join(", ")}</span>
          </p>
          <p className="movie-details__info-item">
            <span>Director:</span>
            <span>{director?.name}</span>
          </p>
          <p className="movie-details__info-item">
            <span>Actors:</span>
            <div>
              {movie?.credits?.cast
                .slice(0, 20)
                .map((castMember, index, array) => (
                  <>
                    <a key={castMember.id} href={`/cast/${castMember.id}`}>
                      {castMember.original_name}
                    </a>
                    {index !== array.length - 1 && <span>, </span>}
                  </>
                ))}
            </div>
          </p>
          <p className="movie-details__info-item">
            <span>Runtime:</span>
            <span>{movie.runtime} min</span>
          </p>
          <p className="movie-details__info-item">
            <span>Rating:</span>
            <span>{movie.vote_average.toFixed(1)}/10</span>
          </p>
          <p className="movie-details__info-item">
            <span>Vote count:</span>
            <span>{movie.vote_count}</span>
          </p>
        </div>
      </div>

      {(previewImages?.length > 0 || trailer) && (
        <>
          <h2>Photos & Videos</h2>
          <div className="movie-details__media">
            <div className="movie-details__images">
              {" "}
              {/* TODO: open all images, videos buttons */}
              {previewImages?.map((image, index) => (
                <img // TODO: clickable img with modal
                  key={index}
                  src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                  alt="Movie image"
                  className="movie-details__image-item"
                />
              ))}
            </div>
            {trailer && (
              <div className="movie-details__trailer">
                <div className="movie-details__video-container">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <h2>Top Cast</h2>
      <div className="movie-details__actors-carousel embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {movie?.credits?.cast.map((actor) => (
              <div className="embla__slide" key={actor.id}>
                <Link
                  to={`/cast/${actor.id}`}
                  className="movie-details__actor-card"
                >
                  <img
                    className="movie-details__actor-photo w-[240px]"
                    src={
                      actor.profile_path
                        ? getImageUrl(actor.profile_path)
                        : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
                    }
                    alt={`${actor.original_name} photo`}
                  />
                  <p>{actor.original_name}</p>
                  <p>{actor.character}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetailsPage;
