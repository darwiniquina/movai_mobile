import { TMDB_PROFILE_BASE } from "@/constants/tmdb";
import { Cast } from "@/interfaces/Cast";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface CastCardProps {
  person: Cast;
  onPress?: (person: Cast) => void;
}

const CastCard: React.FC<CastCardProps> = ({ person, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(person)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: person.profile_path
            ? TMDB_PROFILE_BASE + person.profile_path
            : "https://via.placeholder.com/500x750?text=No+Image",
        }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>
        {person.name}
      </Text>
      {person.character && (
        <Text style={styles.character} numberOfLines={1}>
          {person.character}
        </Text>
      )}
      {person.job && (
        <Text style={styles.job} numberOfLines={1}>
          {person.job}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    marginRight: spacing.md,
  },
  image: {
    width: 100,
    height: 150,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.sm - 1,
    fontWeight: "600",
    marginBottom: 2,
  },
  character: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  job: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontStyle: "italic",
  },
});

export default CastCard;
