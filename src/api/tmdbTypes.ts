export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  genre_ids?: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export type GenresResponse = {
  genres: Genre[];
};

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  cast_id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number; // 0 = unknown, 1 = female, 2 = male
  known_for_department: string;
  character: string;
  order: number;
  popularity: number;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  known_for_department: string;
  department: string;
  job: string;
  popularity: number;
  profile_path: string | null;
  adult?: boolean;
}

export interface Image {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: any | null;
  budget: number;
  genres: Genre[];
  credits?: {
    cast: CastMember[],
    crew: CrewMember[]
  },
  images?: {
    backdrops: Image[];
    logos: Image[];
    posters: Image[];
  }
  homepage: string | null;
  id: number;
  origin_country: string[];
  imdb_id: string | null;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos?: {
    results: Video[];
  };
}