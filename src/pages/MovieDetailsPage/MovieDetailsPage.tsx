import { useGetMoviesQuery } from "@/api/tmdbApi";

export const MovieDetailsPage = () => {
  const { data, isLoading, isError } = useGetMoviesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Failed to load movie</div>;

  return (
    <section>
        <h1>Movie details page</h1>
    </section>
  );
};