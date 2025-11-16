import { ContentCardProps } from "@/interfaces/Movie";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { TMDB_IMAGE_BASE } from "../constants/tmdb";

interface ContentCardExtendedProps extends ContentCardProps {
  style?: StyleProp<ViewStyle>;
  media_type?: "movie" | "tv" | "person";
}

const ContentCard: React.FC<ContentCardExtendedProps> = ({
  content,
  onPress,
  style,
  media_type,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(content)}
    >
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE}${content.poster_path}` }}
        style={styles.image}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />

      {/* Rating */}
      {content?.vote_average != null && (
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>
            ⭐ {Number(content.vote_average).toFixed(1)}
          </Text>
        </View>
      )}

      {/* Media type badge */}
      {media_type && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {media_type === "movie" ? "Movie" : "TV Series"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ContentCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    height: 300,
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#E50914",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
});
