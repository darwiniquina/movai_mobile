import ToggleTabs from "@/components/ui/ToggleTabs";
import WatchlistCard from "@/components/WatchListCard";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  started_at?: string;
  completed_at?: string;
  notes?: string;
  overview?: string;
};

export default function Watchlist() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"planning" | "completed">(
    "planning"
  );
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/watchlist");

      const transformedData = (response.data || []).map((item: any) => ({
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
        started_at: item.started_at,
        completed_at: item.completed_at,
        notes: item.notes,
        overview: item.media_item.overview,
      }));

      setWatchlist(transformedData);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/watchlist/${id}`);
      setWatchlist(watchlist.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const handleToggleStatus = async (item: WatchlistItem) => {
    try {
      const newStatus = item.status === "planning" ? "completed" : "planning";

      await api.post("/watchlist", {
        tmdb_id: item.tmdb_id,
        type: item.type,
        status: newStatus,
      });

      setWatchlist(
        watchlist.map((w) =>
          w.id === item.id ? { ...w, status: newStatus } : w
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleCardPress = (item: WatchlistItem) => {
    const route = item.type === "movie" ? "/movie/[id]" : "/tv/[id]";
    router.push({
      pathname: route,
      params: { id: item.tmdb_id.toString() },
    });
  };

  const filteredWatchlist = watchlist.filter(
    (item) => item.status === activeTab
  );

  const renderItem = ({ item }: { item: WatchlistItem }) => (
    <WatchlistCard
      item={item}
      onPress={handleCardPress}
      onToggleStatus={handleToggleStatus}
      onRemove={handleRemove}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={
          activeTab === "planning"
            ? "list-outline"
            : "checkmark-done-circle-outline"
        }
        size={80}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "planning"
          ? "No items planned"
          : "Nothing completed yet"}
      </Text>
      <Text style={styles.emptyText}>
        {activeTab === "planning"
          ? "Start adding movies and TV shows you want to watch"
          : "Mark items as completed to see them here"}
      </Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Watchlist</Text>
        <Text style={styles.headerSubtitle}>
          {filteredWatchlist.length}{" "}
          {filteredWatchlist.length === 1 ? "item" : "items"}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <ToggleTabs
          activeTab={activeTab}
          onToggle={setActiveTab}
          options={[
            {
              key: "planning",
              label: "Planning",
              icon: (
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={
                    activeTab === "planning" ? colors.primary : colors.text
                  }
                />
              ),
            },
            {
              key: "completed",
              label: "Completed",
              icon: (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color={
                    activeTab === "completed" ? colors.primary : colors.text
                  }
                />
              ),
            },
          ]}
        />
      </View>

      <FlatList
        data={filteredWatchlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={fetchWatchlist}
        ListEmptyComponent={renderEmpty}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  tabContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
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
  },
});
