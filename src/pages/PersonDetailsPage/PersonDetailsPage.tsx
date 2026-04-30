import { Link, useParams } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useGetPersonWithDetailsQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import type { Image } from "@/api/tmdbTypes";
import { formatBiography } from "@/utils/formatBiography";
import { Divider } from "@/components/Divider";
import React, { useEffect, useRef, useState } from "react";

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

const PersonDetailsPage = () => {
  const { id } = useParams();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const ITEMS_PER_BATCH = 15;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

  const {
    data: person,
    isLoading,
    isError,
  } = useGetPersonWithDetailsQuery({ id: id! });

  const movies = person?.movie_credits?.cast || [];
  const visibleMovies = movies.slice(0, visibleCount);

  const formattedBio = formatBiography(person?.biography);

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

  console.log("person", person);

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
              {person.deathday && <div className="personal-info__item">
                <span>Died</span>
                <span>{person.deathday}</span>
              </div>}
              <div className="personal-info__item">
                <span>Place of Birth</span>
                <span>{person.place_of_birth}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {person?.images.profiles?.length > 1 && (
        <>
          <Divider />
          <h2>Photos</h2>
          <div className="personal-details__photos">
            {person?.images.profiles?.slice(0, 5).map((image, index, array) => {
              const photoButton =
                index === array.length - 1 &&
                person?.images?.profiles.length > 5;

              return (
                <React.Fragment key={image.file_path || index}>
                  {photoButton ? ( // TODO: modal with photos
                    <button className="personal-details__photo-button">
                      <img
                        src={getImageUrl(image.file_path, "w500")}
                        alt="Movie image"
                        className="personal-details__photo-item"
                      />
                      <div className="personal-details__photo-button-overlay"></div>
                      <span className="personal-details__photo-button-count">
                        + {person?.images.profiles?.length}
                      </span>
                    </button>
                  ) : (
                    <img
                      src={getImageUrl(image.file_path, "w500")}
                      alt="Movie image"
                      className="personal-details__photo-item"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}

      <Divider />

      <h2>Credits</h2>
      <div className="personal-details__credits">
        {visibleMovies.map((movie) => (
          <div className="personal-details__movie" key={movie.id}>
            <Link to={`/movie/${movie.id}`} className="">
              <img
                className=""
                src={
                  getImageUrl(
                    movie.poster_path || movie.backdrop_path,
                    "w500",
                  ) ||
                  "https://s3-eu-west-1.amazonaws.com/entertainmentie/uploads/2021/08/27144852/generic-movie-poster.jpg"
                }
                alt={`${movie.title}`}
              />
              <p className="personal-details__movie-title">{movie.title}</p>
              <p className="personal-details__movie-character">
                {movie.character}
              </p>
            </Link>
          </div>
        ))}
      </div>
      <div ref={observerRef} style={{ height: 1 }} />
    </section>
  );
};

export default PersonDetailsPage;
