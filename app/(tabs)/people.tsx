import EmojiAvatar from "@/components/EmojiAvatar";
import { UserCardSkeleton } from "@/components/SkeletonLoader";
import api from "@/services/api";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type User = {
  id: number;
  username: string;
  display_name?: string;
  bio?: string;
  emoji_avatar?: string;
};

const HUMOROUS_HEADERS = [
  "People who might share your late-night binge habits 🌙",
  "Fellow film enthusiasts you might vibe with 🎬",
  "Folks who might appreciate your taste in shows 🎭",
  "People who might inspire your next watchlist 👀",
  "Your potential movie night crew 🍿",
  "Kindred spirits who might get your references 📺",
  "People who might become your watch buddies ⭐",
  "Future friends who share your passion 🤔",
  "Souls who might love what you love 💫",
  "Your next binge-watching companions 🎪",
];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [humorousHeader] = useState(
    HUMOROUS_HEADERS[Math.floor(Math.random() * HUMOROUS_HEADERS.length)]
  );

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/people");
      setResults(response.data.results);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    setIsSearching(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setIsSearching(false);
      fetchPeople();
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await api.get("/users/search", {
          params: { query: text },
        });
        setResults(response.data.results);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const handleItemPress = (item: User) => {
    router.push("/profile/" + item.id);
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <EmojiAvatar
          emoji={item?.emoji_avatar || "🎬"}
          size={56}
          colors={{
            primary: colors.primary,
            card: colors.card,
            border: colors.border,
          }}
        />
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.displayName} numberOfLines={1}>
            {item.display_name || item.username}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textSecondary}
          />
        </View>
        <Text style={styles.username}>@{item.username}</Text>
        {item.bio && (
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((index) => (
        <UserCardSkeleton key={index} />
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons
          name="people-outline"
          size={80}
          color={colors.textSecondary}
        />
      </View>
      <Text style={styles.emptyTitle}>No one here yet</Text>
      <Text style={styles.emptyText}>
        {isSearching
          ? "We couldn't find anyone matching your search"
          : "Looks like you're the first one here!"}
      </Text>
      {isSearching && (
        <Text style={styles.emptyHint}>
          Try searching for different names or usernames
        </Text>
      )}
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search for people..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              fetchPeople();
            }}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Section Header */}
      {!query && !loading && results.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{humorousHeader}</Text>
          <Text style={styles.sectionSubtitle}>
            {results.length} {results.length === 1 ? "person" : "people"}
          </Text>
        </View>
      )}

      {query.length > 0 && !isSearching && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <Text style={styles.sectionSubtitle}>
            {results.length} {results.length === 1 ? "match" : "matches"}
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>People</Text>
        <View style={styles.headerIcon}>
          <Ionicons name="people" size={24} color={colors.primary} />
        </View>
      </View>

      {loading ? (
        <View style={styles.content}>
          {renderHeader()}
          {renderSkeleton()}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUser}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.text,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
  },
  clearButton: {
    padding: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  displayName: {
    fontSize: fontSize.md,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  username: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: 4,
  },
  bio: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  skeletonContainer: {
    gap: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: spacing.sm,
  },
});
