import { StyleProp, ViewStyle } from "react-native";

export interface AiLimit {
  limit: number;
  used: number;
  remaining: number;
};

export type SearchResultItem = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv" | "person";
  poster_path?: string;
  profile_path?: string;
  vote_average?: number;
  overview?: string;
};

export interface ContentCardSearchProps {
  item: SearchResultItem;
  onPress: (item: SearchResultItem) => void;
  style?: StyleProp<ViewStyle>;
}
