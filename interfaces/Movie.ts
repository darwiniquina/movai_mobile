export interface Movie {
  id: number;
  title?: string;
  overview?: string;
  name?: string;
  vote_average: number;
  poster_path: string;
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