import ContentCard from "@/components/ContentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ToggleTabs from "@/components/ui/ToggleTabs";
import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { IndexSectionData } from "@/interfaces/Index";
import { Movie } from "@/interfaces/Movie";
import { PersonCredit } from "@/interfaces/Person";
import { Tv } from "@/interfaces/Tv";
import { AuthContext } from "@/lib/AuthContext";
import api from "@/services/api";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function IndexPage() {
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");
  const [moviesData, setMoviesData] = useState<IndexSectionData | null>(null);
  const [tvData, setTvData] = useState<IndexSectionData | null>(null);
  const [featured, setFeatured] = useState<Movie | Tv>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const { user } = useContext(AuthContext);

  const router = useRouter();

  // Removed moviesData from dependencies to prevent infinite loop
  const fetchMovies = useCallback(async (isRefresh = false) => {
    try {
      const [popularMovies, topRatedMovies, upcomingMovies] = await Promise.all([
        api.get("/movies/popular"),
        api.get("/movies/top-rated"),
        api.get("/movies/upcoming"),
      ]);

      const popularResults = popularMovies.data?.data?.results || [];
      const topRatedResults = topRatedMovies.data?.data?.results || [];
      const upcomingResults = upcomingMovies.data?.data?.results || [];

      setMoviesData({
        popular: popularResults,
        topRated: topRatedResults,
        upcoming: upcomingResults,
      });

      if (popularResults.length > 0) {
        setFeatured(popularResults[0]);
      }
      setError(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError(true);
    }
  }, []);

  // Removed tvData from dependencies to prevent infinite loop
  const fetchTVShows = useCallback(async (isRefresh = false) => {
    try {
      const [popularTv, topRatedTv] = await Promise.all([
        api.get("/tv/popular"),
        api.get("/tv/top-rated"),
      ]);

      const popularResults = popularTv.data?.data?.results || [];
      const topRatedResults = topRatedTv.data?.data?.results || [];

      setTvData({
        popular: popularResults,
        topRated: topRatedResults,
      });

      if (popularResults.length > 0) {
        setFeatured(popularResults[0]);
      }
      setError(false);
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      setError(true);
    }
  }, []);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!user) return;

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (activeTab === "movies") {
        await fetchMovies(isRefresh);
      } else {
        await fetchTVShows(isRefresh);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, activeTab, fetchMovies, fetchTVShows]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = (tab: "movies" | "tv") => {
    setActiveTab(tab);
  };

  const handleCardPress = (item: Movie | Tv | PersonCredit) => {
    if (activeTab === "movies") {
      router.push(`/movie/${item.id}`);
    } else if (activeTab === "tv") {
      router.push(`/tv/${item.id}`);
    }
  };

  const renderfeatured = () => {
    if (!featured) return null;

    const title = 'title' in featured ? featured.title : featured.name;
    // Use backdrop_path for a wider image, fallback to poster_path if needed
    const imagePath = featured.backdrop_path || featured.poster_path;

    return (
      <View style={styles.featuredContainer}>
        <View style={styles.featuredCard}>
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}${imagePath}` }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
            style={styles.gradientOverlay}
          />
          
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle} numberOfLines={2}>{title}</Text>
            
            <View style={styles.featuredMeta}>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>
                  {featured.vote_average ? featured.vote_average.toFixed(1) : 'N/A'}
                </Text>
              </View>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>Featured</Text> 
            </View>

            {featured.overview && (
              <Text style={styles.featuredOverview} numberOfLines={3}>
                {featured.overview}
              </Text>
            )}

            <TouchableOpacity 
              style={[styles.actionButton, styles.detailsButton]}
              onPress={() => handleCardPress(featured)}
            >
              <Text style={styles.detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSection = (title: string, items: Movie[]) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section} key={title}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {items.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onPress={handleCardPress}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const dataToRender = activeTab === "movies" ? moviesData : tvData;

  if (loading && !dataToRender && !error) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadData(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={error && !dataToRender ? styles.centerContent : null}
      >
        {error && !dataToRender ? (
          <View style={styles.errorContainer}>
            <Ionicons name="cloud-offline-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorText}>
              We couldn't load the content. Please check your internet connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => loadData(true)}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {renderfeatured()}
            
            <View style={styles.tabsWrapper}>
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
                renderSection("Trending Now", dataToRender.popular)}
              {dataToRender?.topRated &&
                renderSection("Top Rated", dataToRender.topRated)}
              {dataToRender?.upcoming &&
                renderSection("Coming Soon", dataToRender.upcoming)}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height,
  },
  featuredContainer: {
    width: '100%',
    paddingTop: 16,
    marginBottom: 20,
  },
  featuredCard: {
    height: 400,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 16,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingIcon: {
    fontSize: 12,
  },
  ratingText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  featuredOverview: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  detailsButton: {
    backgroundColor: colors.primary,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
