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

export interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  loading?: boolean;
}

export interface IndexSectionData {
  popular?: Movie[];
  topRated?: Movie[];
  upcoming?: Movie[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

