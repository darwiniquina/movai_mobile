import { MovieCardProps } from "@/interfaces/Movie";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TMDB_IMAGE_BASE } from "../constants/tmdb";

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(movie)}>
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE}${movie.poster_path}` }}
        style={styles.image}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
        style={styles.gradientOverlay}
        locations={[0, 0.5, 1]}
      />

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>
          ⭐ {movie.vote_average.toFixed(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;

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
  titleContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 4,
  },
  titleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
});
