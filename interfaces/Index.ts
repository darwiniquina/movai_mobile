import { Movie } from "./Movie";
import { Tv } from "./Tv";

export interface IndexSectionData {
  popular?: Movie[] | Tv[];
  topRated?:  Movie[] | Tv[];
  upcoming?:  Movie[] | Tv[];
}