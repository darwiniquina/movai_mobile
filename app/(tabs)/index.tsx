import MovieCard from "@/components/MovieCard";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ToggleTabs from "@/components/ui/ToggleTabs";
import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { IndexSectionData, Movie } from "@/interfaces/Movie";
import { AuthContext } from "@/lib/AuthContext";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");
  const [moviesData, setMoviesData] = useState<IndexSectionData | null>(null);
  const [tvData, setTvData] = useState<IndexSectionData | null>(null);
  const [featuredMovie, setFeaturedMovie] = useState<Movie>();
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log("No user");
      setLoading(false);
      return;
    }

    async function fetchMovies() {
      setLoading(true);
      try {
        const [popularMovies, topRatedMovies, upcomingMovies] =
          await Promise.all([
            api.get("/movies/popular"),
            api.get("/movies/top-rated"),
            api.get("/movies/upcoming"),
          ]);

        const popularResults = popularMovies.data?.data?.results || [];
        const topRatedResults = topRatedMovies.data?.data?.results || [];
        const upcomingResults = upcomingMovies.data?.data?.results || [];

        console.log("Popular:", popularResults.length);
        console.log("Top Rated:", topRatedResults.length);
        console.log("Upcoming:", upcomingResults.length);

        setMoviesData({
          popular: popularResults,
          topRated: topRatedResults,
          upcoming: upcomingResults,
        });

        if (popularResults.length > 0) {
          setFeaturedMovie(popularResults[0]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [user]);

  const fetchTVShows = async () => {
    if (tvData) return;

    setLoading(true);
    try {
      const [popularTv, topRatedTv] = await Promise.all([
        api.get("/tv/popular"),
        api.get("/tv/top-rated"),
      ]);

      const popularResults = popularTv.data?.data?.results || [];
      const topRatedResults = topRatedTv.data?.data?.results || [];

      console.log("Popular:", popularResults.length);
      console.log("Top Rated:", topRatedResults.length);

      setTvData({
        popular: popularResults,
        topRated: topRatedResults,
      });
    } catch (error) {
      console.error("Error fetching TV shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (tab: "movies" | "tv") => {
    setActiveTab(tab);
    if (tab === "tv") {
      fetchTVShows();
    }
  };

  const handleCardPress = (item: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: item.id.toString() },
    });
  };

  const renderFeaturedMovie = () => {
    if (!featuredMovie) return null;

    return (
      <View style={styles.featuredCard}>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE}${featuredMovie.poster_path}` }}
          style={styles.featuredImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          style={styles.gradientOverlay}
        />

        <View style={styles.featuredContent}>
          {featuredMovie.vote_average != null && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>
                {featuredMovie.vote_average.toFixed(1)}
              </Text>
              <Text style={styles.ratingOutOf}>/10</Text>
            </View>
          )}

          <Text style={styles.featuredTitle}>
            {featuredMovie.title || featuredMovie.name}
          </Text>

          {featuredMovie.overview && (
            <Text style={styles.featuredOverview} numberOfLines={3}>
              {featuredMovie.overview}
            </Text>
          )}

          <Button
            title="More Info"
            onPress={() => handleCardPress(featuredMovie)}
          />
        </View>
      </View>
    );
  };

  const renderSection = (title: string, items: Movie[]) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item) => (
            <MovieCard key={item.id} movie={item} onPress={handleCardPress} />
          ))}
        </ScrollView>
      </View>
    );
  };

  const dataToRender = activeTab === "movies" ? moviesData : tvData;

  if (loading && !dataToRender) {
    return <LoadingSpinner />;
  }

  if (!moviesData) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>
          No data available, try again later
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderFeaturedMovie()}

        <View style={styles.tabsContainer}>
          <ToggleTabs
            activeTab={activeTab}
            onToggle={handleToggle}
            options={[
              { key: "movies", label: "Movies" },
              { key: "tv", label: "TV Shows" },
            ]}
          />
        </View>

        <View style={styles.contentContainer}>
          {dataToRender?.popular &&
            renderSection("Popular", dataToRender.popular)}
          {dataToRender?.topRated &&
            renderSection("Top Rated", dataToRender.topRated)}
          {dataToRender?.upcoming &&
            renderSection("Upcoming", dataToRender.upcoming)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  section: {
    margin: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "800",
    marginBottom: 20,
    color: colors.text,
    letterSpacing: 0.5,
  },
  featuredCard: {
    width: "100%",
    height: 550,
    position: "relative",
    backgroundColor: "#000",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 80,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  ratingIcon: {
    fontSize: fontSize.sm,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  ratingOutOf: {
    color: "#fff",
    fontSize: fontSize.sm,
    opacity: 0.7,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: 0.2,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  featuredOverview: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    letterSpacing: 0.2,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  tabsContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
});
