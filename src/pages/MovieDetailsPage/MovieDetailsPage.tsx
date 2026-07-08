import { useGetCollectionDetailsQuery, useGetMovieWithDetailsQuery } from "@/api/tmdbApi";
import type { Review } from "@/api/tmdbTypes";
import { getImageUrl } from "@/api/tmdbConfig";
import { Divider } from "@/components/Divider";
import MovieCard from "@/components/MovieCard/MovieCard";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import React from "react";

const INITIAL_REVIEWS_COUNT = 3;
const REVIEW_PREVIEW_CHAR_LIMIT = 280;

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [expandedReviewIds, setExpandedReviewIds] = useState<Set<string>>(
    new Set(),
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [emblaRef] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [recommendationsRef] = useEmblaCarousel({
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
  const { data: collectionDetails } = useGetCollectionDetailsQuery(movie?.belongs_to_collection?.id ?? 0);
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

  useEffect(() => {
    setExpandedReviewIds(new Set());
    setShowAllReviews(false);
  }, [id]);

  const reviews = movie?.reviews?.results ?? [];
  const recommendations = movie?.recommendations?.results ?? [];
  const visibleReviews = showAllReviews
    ? reviews
    : reviews.slice(0, INITIAL_REVIEWS_COUNT);
  const hasMoreReviews = reviews.length > INITIAL_REVIEWS_COUNT;

  const isReviewLong = (content: string) =>
    content.length > REVIEW_PREVIEW_CHAR_LIMIT;

  const toggleReviewExpanded = (reviewId: string) => {
    setExpandedReviewIds((prev) => {
      const next = new Set(prev);

      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }

      return next;
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !movie) return <div>Failed to load movie</div>;

  // if (true) throw new Error("test");

  console.log(movie);

  return (
    <section className="movie-details">
      <h1>{movie.title}</h1>

      <div className="movie-details__main-info">
        <MovieCard
          id={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          imageSize="w500"
          variant="poster"
          fetchPriority="high"
        />

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
                  <React.Fragment key={castMember.id}>
                    <a href={`/cast/${castMember.id}`}>
                      {castMember.original_name}
                    </a>
                    {index !== array.length - 1 && <span>, </span>}
                  </React.Fragment>
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
            {previewImages?.length > 0 && <div className="movie-details__images">
              {/* TODO: open all images, videos buttons */}
              {previewImages?.map((image, index) => (
                <img // TODO: clickable img with modal
                  key={index}
                  src={`https://image.tmdb.org/t/p/w300${image.file_path}`}
                  alt="Movie image"
                  className="movie-details__image-item"
                />
              ))}
            </div>}
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

      {collectionDetails && collectionDetails.parts.length > 0 && (
        <>
          <h2>Collection</h2>
          <div className="movie-details__collection-movies movie-card-grid">
            {collectionDetails.parts.map((part) => (
              <MovieCard
                key={part.id}
                id={part.id}
                title={part.title}
                posterPath={part.poster_path}
                imageSize="w500"
                fetchPriority="high"
                noActionButtons={true}
              />
            ))}
          </div>
        </>
      )}

      {reviews.length > 0 && (
        <>
          <h2>Reviews</h2>
          <div className="movie-details__reviews">
            {visibleReviews.map((review) => {
              const isExpanded = expandedReviewIds.has(review.id);
              const showToggle = isReviewLong(review.content);

              return (
                <article
                  className={cn("movie-details__review", {
                    isClamped: showToggle && !isExpanded,
                    isExpanded: isExpanded,
                  })}
                  key={review.id}
                >
                  <p className="movie-details__review-author">
                    {review.author || review.author_details.username}
                  </p>
                  <p
                    className={cn("movie-details__review-content", {
                      isExpanded,
                      isClamped: showToggle && !isExpanded,
                    })}
                  >
                    {review.content}
                  </p>
                  {showToggle && (
                    <button
                      type="button"
                      className="movie-details__review-toggle"
                      onClick={() => toggleReviewExpanded(review.id)}
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </article>
              );
            })}

            {hasMoreReviews && !showAllReviews && (
              <button
                type="button"
                className="movie-details__reviews-show-all"
                onClick={() => setShowAllReviews(true)}
              >
                Show all reviews ({reviews.length})
              </button>
            )}
          </div>
        </>
      )}

      {recommendations.length > 0 && (
        <>
          <h2>Recommended Movies</h2>
          <div className="movie-details__recommendations-carousel embla">
            <div className="embla__viewport" ref={recommendationsRef}>
              <div className="embla__container">
                {recommendations.map((recommendedMovie) => (
                  <div className="embla__slide" key={recommendedMovie.id}>
                    <Link
                      to={`/movie/${recommendedMovie.id}`}
                      className="movie-details__recommendation-card"
                    >
                      <img
                        className="movie-details__recommendation-poster w-[240px]"
                        src={
                          recommendedMovie.poster_path
                            ? getImageUrl(recommendedMovie.poster_path, "w342")
                            : "https://upload.wikimedia.org/wikipedia/commons/2/2f/No-photo-m.png"
                        }
                        alt={`${recommendedMovie.title} poster`}
                      />
                      <p>{recommendedMovie.title}</p>
                      <p>{recommendedMovie.vote_average.toFixed(1)}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MovieDetailsPage;
