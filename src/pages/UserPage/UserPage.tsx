import { useGetGenresQuery, useGetMoviesByIdsQuery } from "@/api/tmdbApi";
import MovieCard from "@/components/MovieCard/MovieCard";
import { db } from "@/firebase";
import { useAppDispatch } from "@/hooks";
import { useAuth } from "@/hooks/useAuth";
import { setFavoriteGenres } from "@/store/slices/authSlice";
import cn from "classnames";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const UserPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const watchListIds = user?.watchList ?? [];
  const { data: genresData, isLoading: isGenresLoading } = useGetGenresQuery();
  const {
    data: watchListMovies = [],
    isLoading: isWatchListLoading,
    isFetching: isWatchListFetching,
  } = useGetMoviesByIdsQuery(watchListIds, { skip: watchListIds.length === 0 });
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isLoadingWatchList =
    watchListIds.length > 0 && (isWatchListLoading || isWatchListFetching);

  if (!user) {
    return null;
  }

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        favoriteGenres: selectedGenres,
        updatedAt: serverTimestamp(),
      });

      dispatch(setFavoriteGenres(selectedGenres));
    } catch (err) {
      console.error("Failed to update favorite genres:", err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setSelectedGenres(user?.favoriteGenres ?? []);
  }, [user?.favoriteGenres]);

  return (
    <div className="user-page">
      <h1>Welcome, {user.displayName || user.fullName || "User"}!</h1>

      <section className="user-page__genres">
        <h2 className="user-page__genres-title">Favorite genres</h2>
        <p className="user-page__genres-description">
          Select the genres you enjoy most, then save your choices.
        </p>

        {isGenresLoading && <p>Loading genres...</p>}

        {!isGenresLoading && genresData?.genres && (
          <div className="user-page__genres-list">
            {genresData.genres.map((genre) => (
              <label
                key={genre.id}
                className={cn("user-page__genre-option", {
                  isSelected: selectedGenres.includes(genre.id),
                })}
              >
                <span className="material-symbols-sharp material-symbols">
                  {selectedGenres.includes(genre.id) ? "check_box" : "check_box_outline_blank"}
                </span>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => toggleGenre(genre.id)}
                />
                {genre.name}
              </label>
            ))}
          </div>
        )}

        <button
          type="button"
          className="user-page__genres-save-btn"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save genres"}
        </button>
      </section>

      <section className="user-page__watch-list">
        <h2 className="user-page__watch-list-title">Watch list</h2>

        {isLoadingWatchList && <p>Loading watch list...</p>}

        {!isLoadingWatchList && watchListIds.length === 0 && (
          <p className="user-page__watch-list-empty">
            You have not added any movies to your watch list yet.
          </p>
        )}

        {!isLoadingWatchList && watchListMovies.length > 0 && (
          <div className="movie-card-grid">
            {watchListMovies.map((movie) => (
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
      </section>
    </div>
  );
};

export default UserPage;
