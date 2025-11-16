import Button from "@/components/ui/Button";
import { AuthContext } from "@/lib/AuthContext";
import api from "@/services/api";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  public_profile: boolean;
  email: string;
  email_verified_at: string | null;
  to_watch_count: number;
  completed_count: number;
  created_at: string;
  updated_at: string;
};

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
  updated_at: string;
};

type WatchlistTab = "all" | "planning" | "completed";

export default function Profile() {
  const router = useRouter();
  const { user: authUser } = useContext(AuthContext);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WatchlistTab>("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [profileResponse, watchlistResponse] = await Promise.all([
        api.get("/user"),
        api.get("/watchlist"),
      ]);

      setUser(profileResponse.data.user);

      // Transform and sort watchlist items by latest update
      const transformedData = (watchlistResponse.data || [])
        .map((item: any) => ({
          id: item.id,
          tmdb_id: item.media_item.tmdb_id,
          title: item.media_item.title,
          name: item.media_item.name,
          type: item.media_item.type,
          poster_path: item.media_item.poster_path,
          vote_average: item.media_item.vote_average,
          release_date: item.media_item.release_date,
          first_air_date: item.media_item.first_air_date,
          status: item.status,
          overview: item.media_item.overview,
          updated_at: item.updated_at,
        }))
        .sort(
          (a: WatchlistItem, b: WatchlistItem) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      setWatchlist(transformedData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const navigateToSettings = () => {
    router.push("/profile-settings");
  };

  const handleItemPress = (item: WatchlistItem) => {
    const route = item.type === "movie" ? "/movie/[id]" : "/tv/[id]";
    router.push({
      pathname: route,
      params: { id: item.tmdb_id.toString() },
    });
  };

  const getFilteredWatchlist = () => {
    switch (activeTab) {
      case "planning":
        return watchlist.filter((item) => item.status === "planning");
      case "completed":
        return watchlist.filter((item) => item.status === "completed");
      default:
        return watchlist;
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "completed" ? "checkmark-circle" : "time";
  };

  const getStatusColor = (status: string) => {
    return status === "completed" ? colors.primary : colors.warning;
  };

  const renderMediaItem = ({ item }: { item: WatchlistItem }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image",
        }}
        style={styles.mediaPoster}
      />

      {/* Status Overlay */}
      <View
        style={[
          styles.statusOverlay,
          { backgroundColor: getStatusColor(item.status) + "CC" },
        ]}
      >
        <Ionicons
          name={getStatusIcon(item.status)}
          size={20}
          color={colors.background}
        />
      </View>

      {/* Media Type Badge */}
      <View style={styles.mediaTypeBadge}>
        <Text style={styles.mediaTypeText}>
          {item.type === "movie" ? "MOVIE" : "TV"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="film-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No items yet</Text>
      <Text style={styles.emptyText}>
        {activeTab === "all"
          ? "Start adding movies and TV shows to your watchlist"
          : activeTab === "planning"
          ? "No items planned to watch yet"
          : "No completed items yet"}
      </Text>
      <Button
        title="Browse Movies & TV"
        onPress={() => router.push("/")}
        style={styles.browseButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const filteredWatchlist = getFilteredWatchlist();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={navigateToSettings}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredWatchlist}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => fetchUserData(true)}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person"
                    size={40}
                    color={colors.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user?.name || "User"}</Text>
                <Text style={styles.username}>@{user?.username}</Text>

                {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}

                <Text style={styles.joinDate}>
                  Joined{" "}
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    : "N/A"}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{watchlist.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.to_watch_count || 0}
                </Text>
                <Text style={styles.statLabel}>To Watch</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {user?.completed_count || 0}
                </Text>
                <Text style={styles.statLabel}>Watched</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "all" && styles.activeTab]}
                onPress={() => setActiveTab("all")}
              >
                <Ionicons
                  name="grid"
                  size={18}
                  color={
                    activeTab === "all" ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "all" && styles.activeTabText,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "planning" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("planning")}
              >
                <Ionicons
                  name="time"
                  size={18}
                  color={
                    activeTab === "planning"
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "planning" && styles.activeTabText,
                  ]}
                >
                  Planning
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "completed" && styles.activeTab,
                ]}
                onPress={() => setActiveTab("completed")}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={
                    activeTab === "completed"
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "completed" && styles.activeTabText,
                  ]}
                >
                  Watched
                </Text>
              </TouchableOpacity>
            </View>

            {/* Section Title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeTab === "all"
                  ? "All Items"
                  : activeTab === "planning"
                  ? "Planning to Watch"
                  : "Watched"}
              </Text>
              <Text style={styles.sectionCount}>
                {filteredWatchlist.length}{" "}
                {filteredWatchlist.length === 1 ? "item" : "items"}
              </Text>
            </View>
          </>
        }
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  settingsButton: {
    padding: spacing.xs,
  },
  profileHeader: {
    flexDirection: "row",
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  avatarContainer: {
    marginRight: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: fontSize.sm,
    color: colors.text,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  joinDate: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary + "20",
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.text,
  },
  sectionCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  gridContainer: {
    paddingBottom: 100,
  },
  mediaItem: {
    flex: 1,
    aspectRatio: 2 / 3,
    margin: 1,
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.card,
  },
  mediaPoster: {
    width: "100%",
    height: "100%",
  },
  statusOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 12,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaTypeBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: colors.background + "CC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mediaTypeText: {
    fontSize: fontSize.xs - 2,
    fontWeight: "bold",
    color: colors.text,
    textTransform: "uppercase",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  browseButton: {
    marginTop: spacing.sm,
  },
});
