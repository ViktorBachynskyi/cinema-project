import { useGetMovieWithDetailsQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import { useParams } from "react-router-dom";

const MovieDetailsPage = () => {
  const { id } = useParams();

  const {
    data: movie,
    isLoading,
    isError,
  } = useGetMovieWithDetailsQuery({
    id: id!,
  });
  const director = movie?.credits?.crew.find(
    (crewMember) => crewMember.job === "Director",
  );

  if (isLoading) return <div>Loading...</div>;
  if (isError || !movie) return <div>Failed to load movie</div>;

  console.log(movie);

  const backdrops = (movie?.images?.backdrops ?? []).filter((img) => {
    // exclude poster-like images
    return img.width >= 2100 && img.width / img.height >= 1.5;
  });

  // Sort by total pixel area (width * height) descending
  const sortedBySize = backdrops.sort(
    (a, b) => b.width * b.height - a.width * a.height,
  );

  // Take first 6 images
  const previewImages = sortedBySize.slice(0, 9);

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube",
  );

  return (
    <section className="movie-details">
      <h1>{movie.title}</h1>

      <div className="movie-details__main-info">
        <img
          className="movie-details__poster w-[342px]"
          src={getImageUrl(movie.poster_path, "w342")}
          alt={movie.title}
        />

        <div className="movie-details__info">
          <p>{movie.overview}</p>
          <div className="line-break"></div>
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
                    <a key={castMember.id} href={`/actor/${castMember.id}`}>
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
    </section>
  );
};

export default MovieDetailsPage;
