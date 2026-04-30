import { useGetMoviesQuery } from "@/api/tmdbApi";
import { getImageUrl } from "@/api/tmdbConfig";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data, isLoading, isError } = useGetMoviesQuery({
    page: 1,
    sort_by: "popularity.desc",
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Failed to load movies</div>;

  return (
    <div className="home">
      <h2 className="mb-4 text-2xl font-bold">Popular movies</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {data.results.slice(0, 15).map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            className="rounded-2xl border border-border-default bg-bg-surface p-4 hover:bg-bg-surface-hover hover:border-border-hover"
          >
            <img
              className="w-full object-cover"
              src={getImageUrl(movie.poster_path, "w500")}
              alt="alt"
            />
            <div className="text-sm font-medium mt-1">
              {movie.title}
            </div>
            <div className="mt-1 text-xs">
              {movie.vote_average.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
