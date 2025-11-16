export type Person = {
 id: number;
  name: string;
  profile_path: string;
  biography: string;
  birthday: string;
  deathday?: string;
  place_of_birth: string;
  known_for_department: string;
  also_known_as?: string[];
  popularity: number;
  movie_credits?: {
    cast?: PersonCredit[];
    crew?: PersonCredit[];
  };
  tv_credits?: {
    cast?: PersonCredit[];
    crew?: PersonCredit[];
  };
  poster_path?: string;
  vote_average?: number;
};

export type PersonCredit = {
  id: number;
  title?: string;
  name?: string;
  media_type?: string;
  poster_path?: string;
  character?: string;
  job?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};
