import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "@/api/tmdbTypes";

interface User {
  uid: string;
  email: string | null;
  fullName?: string | null;
  displayName?: string | null;
  age?: number | null;
  favorites?: number[];
  favoriteMovies?: Movie[] | null;
  favoriteGenres?: number[];
  watchList?: number[];
}

interface AuthState {
  user: User | null;
  isAuthReady: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthReady = true;
    },
    setFavorites(state, action: PayloadAction<number[]>) {
      if (state.user) {
        state.user.favorites = action.payload;
      }
    },
    setFavoriteMovies(state, action: PayloadAction<Movie[] | null>) {
      if (state.user) {
        state.user.favoriteMovies = action.payload;
      }
    },
    setFavoriteGenres(state, action: PayloadAction<number[]>) {
      if (state.user) {
        state.user.favoriteGenres = action.payload;
      }
    },
    setWatchList(state, action: PayloadAction<number[]>) {
      if (state.user) {
        state.user.watchList = action.payload;
      }
    },
  },
});

export const {
  setUser,
  setFavorites,
  setFavoriteMovies,
  setFavoriteGenres,
  setWatchList,
} = authSlice.actions;
export default authSlice.reducer;
