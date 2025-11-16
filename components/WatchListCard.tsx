import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type WatchlistItem = {
  id: number;
  tmdb_id: number;
  title?: string;
  name?: string;
  type: "movie" | "tv";
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  status: "planning" | "completed";
  overview?: string;
};

interface WatchlistCardProps {
  item: WatchlistItem;
  onPress: (item: WatchlistItem) => void;
  onToggleStatus: (item: WatchlistItem) => void;
  onRemove: (id: number) => void;
}

const WatchlistCard: React.FC<WatchlistCardProps> = ({
  item,
  onPress,
  onToggleStatus,
  onRemove,
}) => {
  const displayTitle = item.title || item.name || "Unknown";
  const displayDate = item.release_date || item.first_air_date;
  const year = displayDate ? new Date(displayDate).getFullYear() : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      {/* Poster */}
      <Image
        source={{
          uri: item.poster_path ? TMDB_IMAGE_BASE + item.poster_path : "",
        }}
        style={styles.poster}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle}
          </Text>

          <View style={styles.metaContainer}>
            {year && <Text style={styles.metaText}>{year}</Text>}
            {item.vote_average && (
              <>
                <Text style={styles.separator}>•</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color={colors.primary} />
                  <Text style={styles.rating}>
                    {item.vote_average.toFixed(1)}
                  </Text>
                </View>
              </>
            )}
            <Text style={styles.separator}>•</Text>
            <Text style={styles.mediaType}>
              {item.type === "movie" ? "Movie" : "TV Show"}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton]}
            onPress={(e) => {
              e.stopPropagation();
              onToggleStatus(item);
            }}
          >
            <MaterialIcons
              name={item.status === "planning" ? "check-circle" : "restore"}
              size={16}
              color={colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.removeButton]}
            onPress={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: "center",
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: borderRadius.sm,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  textContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: 2,
    fontWeight: "600",
  },
  separator: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  mediaType: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: colors.primary + "20",
  },
  removeButton: {
    backgroundColor: colors.error + "20",
  },
});

export default WatchlistCard;
