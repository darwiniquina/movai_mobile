import { Cast } from "./Cast";
import { PersonCredit } from "./Person";
import { Tv } from "./Tv";
import { Video } from "./Video";

export interface Movie {
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

export interface ContentCardProps {
  content: Movie | Tv | PersonCredit;
  onPress: any;
  loading?: boolean;
}