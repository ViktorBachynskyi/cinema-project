import MovieCard from "@/components/MovieCard/MovieCard";
import { Divider } from "@/components/Divider";
import { useGetPersonWithDetailsQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import type { Image } from "@/api/tmdbTypes";
import { formatBiography } from "@/utils/formatBiography";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const PersonPhotosModal = lazy(
  () => import("@/components/PersonPhotosModal/PersonPhotosModal"),
);

export interface PersonMovieCredit {
  id: number;
  creditId: string;
  title: string;
  original_title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  genreIds: number[];
  releaseDate: string;
  original_language: string;
  popularity: number;
  softcore: boolean;
  character: string;
}

export interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
  images: {
    profiles: Image[];
  };
  movie_credits: {
    cast: PersonMovieCredit[];
  };
}

const PREVIEW_PHOTOS_LIMIT = 5;

const PersonDetailsPage = () => {
  const { id } = useParams();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_BATCH = 15;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const {
    data: person,
    isLoading,
    isError,
  } = useGetPersonWithDetailsQuery({ id: id! });

  const movies = person?.movie_credits?.cast || [];
  const visibleMovies = movies.slice(0, visibleCount);
  const photos = person?.images.profiles ?? [];
  const previewPhotos = photos.slice(0, PREVIEW_PHOTOS_LIMIT);

  const formattedBio = formatBiography(person?.biography);

  const openGallery = (index: number) => {
    setActivePhotoIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting) {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_BATCH, movies.length),
        );
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [movies.length]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !person) return <div>Failed to load movie</div>;

  return (
    <section className="person-details">
      <div className="person-details__info">
        <img
          className="person-details__photo w-[342px]"
          src={getImageUrl(person.profile_path, "w500")}
          alt={person.name}
          fetchPriority="high"
        />

        <div className="flex flex-col">
          <div>
            <h1>{person.name}</h1>
            {person?.biography && (
              <>
                <h2>Biography</h2>
                <div className="personal-info__bio-container">
                  {formattedBio.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <Divider />
              </>
            )}
          </div>

          <div className="person-details__personal-info">
            <h2>Personal Info</h2>
            <div className="personal-info__items">
              <div className="personal-info__item">
                <span>Known For</span>
                <span>{person.known_for_department}</span>
              </div>
              <div className="personal-info__item">
                <span>Birthday</span>
                <span>{person.birthday}</span>
              </div>
              {person.deathday && (
                <div className="personal-info__item">
                  <span>Died</span>
                  <span>{person.deathday}</span>
                </div>
              )}
              <div className="personal-info__item">
                <span>Place of Birth</span>
                <span>{person.place_of_birth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {photos.length > 1 && (
        <>
          <Divider />
          <h2>Photos</h2>
          <div className="personal-details__photos">
            {previewPhotos.map((image, index) => {
              const showMoreOverlay =
                index === previewPhotos.length - 1 &&
                photos.length > PREVIEW_PHOTOS_LIMIT;

              return (
                <button
                  key={image.file_path || index}
                  type="button"
                  className="personal-details__photo-button"
                  aria-label={`Open photo ${index + 1}`}
                  onClick={() => openGallery(index)}
                >
                  <img
                    src={getImageUrl(image.file_path, "w500")}
                    alt={`${person.name} photo ${index + 1}`}
                    className="personal-details__photo-item"
                  />
                  {showMoreOverlay && (
                    <>
                      <div className="personal-details__photo-button-overlay" />
                      <span className="personal-details__photo-button-count">
                        + {photos.length - PREVIEW_PHOTOS_LIMIT}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      {isGalleryOpen && (
        <Suspense fallback={null}>
          <PersonPhotosModal
            isOpen={isGalleryOpen}
            photos={photos}
            initialIndex={activePhotoIndex}
            onClose={closeGallery}
          />
        </Suspense>
      )}

      <Divider />

      <h2>Credits</h2>
      <div className="movie-card-grid movie-card-grid--dense">
        {visibleMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            backdropPath={movie.backdrop_path}
            subtitle={movie.character}
          />
        ))}
      </div>
      <div ref={observerRef} style={{ height: 1 }} />
    </section>
  );
};

export default PersonDetailsPage;
