import { Cast } from "./Cast";
import { Video } from "./Video";

export interface Tv {
  id: number;
  title?: string;
  overview?: string;
  name?: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  poster_path: string;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  credits?: {
    cast: Cast[];
  };
  videos?: {
    results: Video[];
  };
  backdrop_path: string;
}

export interface TvCardProps {
  Tv: Tv;
  onPress: (Tv: Tv) => void;
  loading?: boolean;
}