import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { ContentCardSearchProps } from "@/interfaces/Search";
import { colors } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ContentCardSearch: React.FC<ContentCardSearchProps> = ({
  item,
  onPress,
  style,
}) => {
  const imageUri =
    item.poster_path || item.profile_path
      ? `${TMDB_IMAGE_BASE}${item.poster_path || item.profile_path}`
      : undefined;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={() => onPress(item)}
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
        style={styles.gradientOverlay}
      />

      {/* Media Type Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {item.media_type === "movie"
            ? "Movie"
            : item.media_type === "tv"
            ? "TV Series"
            : "Person"}
        </Text>
      </View>

      {/* Rating for movies/TV */}
      {(item.media_type === "movie" || item.media_type === "tv") &&
        item.vote_average != null && (
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ⭐ {item.vote_average.toFixed(1)}
            </Text>
          </View>
        )}

      {/* Title and Overview */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title || item.name}
        </Text>
        {item.overview && (
          <Text style={styles.overview} numberOfLines={3}>
            {item.overview}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContentCardSearch;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 500,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#111",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  ratingContainer: {
    position: "absolute",
    top: 8,
    right: 8,
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
  textContainer: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overview: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});
