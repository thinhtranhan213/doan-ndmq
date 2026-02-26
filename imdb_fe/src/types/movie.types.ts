
// Base Movie interface
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  popularity: number;
  genre_ids?: number[];
}

// Detailed Movie interface
export interface MovieDetail extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  genres: Genre[];
  production_companies: ProductionCompany[];
  spoken_languages: Language[];
}

// Genre interface
export interface Genre {
  id: number;
  name: string;
}

// Cast Member interface
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

// Crew Member interface
export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// Credits Response interface
export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// Review interface
export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  rating: number | null;
  url: string;
}

// API Response interface with pagination
export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Production Company interface
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

// Language interface
export interface Language {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Image Configuration
export interface ImageConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
}

// Video interface
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
}

// Video Response interface
export interface VideoResponse {
  id: number;
  results: Video[];
}
