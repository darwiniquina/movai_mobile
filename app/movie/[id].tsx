import CastCard from "@/components/CastCard";
import ContentCard from "@/components/ContentCard";
import ToggleTabs from "@/components/ui/ToggleTabs";
import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { Cast } from "@/interfaces/Cast";
import { Movie } from "@/interfaces/Movie";
import { Video } from "@/interfaces/Video";
import api from "@/services/api";
import readableDate from "@/services/readableDate";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get("window");

const MovieDetail = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: number };
  const playerRef = useRef(null);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"similar" | "recommended">(
    "similar"
  );
  const [playing, setPlaying] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    fetchMovieData();
    checkWatchlistStatus();
  }, [id]);

  const checkWatchlistStatus = async () => {
    try {
      const response = await api.get(`/watchlist/${id}`);
      setIsInWatchlist(response.data?.exists || false);
    } catch (error) {
      console.error("Error checking watchlist status:", error);
    }
  };

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const [movieRes, similarRes] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get(`/movies/${id}/similar`),
      ]);

      const movieData = movieRes.data.data;
      const similarData = similarRes.data.data;

      setMovie(movieData);
      setSimilar(similarData.results || []);

      if (movieData.credits?.cast) {
        setCast(movieData.credits.cast.slice(0, 10));
      }

      if (movieData.videos?.results) {
        const trailerVideo =
          movieData.videos.results.find(
            (video: Video) =>
              video.type === "Trailer" &&
              video.site === "YouTube" &&
              video.official
          ) ||
          movieData.videos.results.find(
            (video: Video) =>
              video.type === "Trailer" && video.site === "YouTube"
          );
        setTrailer(trailerVideo || null);
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommended = async () => {
    if (recommended.length > 0) return;
    try {
      const res = await api.get(`/movies/${id}/recommendations`);
      const recommendedData = res.data.data;
      setRecommended(recommendedData.results || []);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleTabChange = (tab: "similar" | "recommended") => {
    if (tab === "recommended") {
      fetchRecommended();
    }
    setActiveTab(tab);
  };

  const handleClosePlayer = () => {
    setPlaying(false);
  };

  const handlePlayTrailer = () => {
    setPlaying(true);
  };

  const handleCardPress = (item: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: item.id.toString() },
    });
  };

  const handleCastPress = (person: Cast) => {
    router.push({
      pathname: "/person/[id]",
      params: { id: person.id.toString() },
    });
  };

  const toggleWatchlist = async () => {
    if (!movie) return;

    try {
      setWatchlistLoading(true);

      if (!isInWatchlist) {
        await api.post("/watchlist", {
          tmdb_id: movie.id,
          type: "movie",
          status: "planning",
        });
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error("Error toggling watchlist:", error);
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return null;
  }

  // Determine which movies to display based on active tab
  const displayedMovies = activeTab === "similar" ? similar : recommended;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.backdropContainer}>
          {playing && trailer ? (
            <View>
              <YoutubePlayer
                ref={playerRef}
                height={200}
                width={width}
                videoId={trailer.key}
                play={true}
                initialPlayerParams={{
                  controls: true,
                  modestbranding: true,
                  rel: false,
                }}
                onChangeState={(state: string) => {
                  if (state === "ended") {
                    handleClosePlayer();
                  }
                }}
              />
            </View>
          ) : (
            <>
              <Image
                source={{
                  uri: movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                    : "https://via.placeholder.com/1280x720?text=No+Image",
                }}
                style={styles.backdrop}
              />
              <View style={styles.backdropOverlay} />

              {trailer && (
                <TouchableOpacity
                  style={styles.playButtonOverlay}
                  onPress={handlePlayTrailer}
                >
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶</Text>
                  </View>
                  <Text style={styles.playButtonLabel}>Play Trailer</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Movie Info */}
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Image
              source={{
                uri: TMDB_IMAGE_BASE + movie.poster_path,
              }}
              style={styles.poster}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.tagline}>"{movie.tagline || ""}"</Text>

                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>
                    ⭐ {movie.vote_average.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.metaInfoSeparator}>•</Text>
                <Text style={styles.meta}>Movie</Text>
                <Text style={styles.metaInfoSeparator}>•</Text>
                <Text style={styles.meta}>{movie.runtime} min</Text>
              </View>

              <Text style={styles.meta}>
                Released on {readableDate(movie.release_date)}
              </Text>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {movie.genres.map((genre) => (
                    <View key={genre.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Watchlist Button */}
              <TouchableOpacity
                onPress={toggleWatchlist}
                disabled={watchlistLoading}
                style={[
                  styles.watchlistButton,
                  isInWatchlist && styles.watchlistButtonActive,
                ]}
              >
                <Ionicons
                  name={
                    isInWatchlist ? "checkmark-circle" : "add-circle-outline"
                  }
                  size={20}
                  color={isInWatchlist ? colors.background : colors.primary}
                />
                <Text
                  style={[
                    styles.watchlistButtonText,
                    isInWatchlist && styles.watchlistButtonTextActive,
                  ]}
                >
                  {watchlistLoading
                    ? "Loading..."
                    : isInWatchlist
                    ? "In Watchlist"
                    : "Add to Watchlist"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>

          {/* Cast */}
          {cast.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {cast.map((person) => (
                  <CastCard
                    key={person.id}
                    person={person}
                    onPress={handleCastPress}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.tabContainer}>
            <ToggleTabs
              activeTab={activeTab}
              onToggle={handleTabChange}
              options={[
                { key: "similar", label: "Similar" },
                { key: "recommended", label: "Recommended" },
              ]}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {displayedMovies.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onPress={handleCardPress}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
  backdropContainer: {
    position: "relative",
    height: 200,
  },
  backdrop: {
    width: "100%",
    height: "100%",
  },
  backdropOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  playButtonOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -50 }],
    alignItems: "center",
    opacity: 0.3,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.primary}E6`,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    color: "#fff",
    fontSize: 32,
    marginLeft: 5,
  },
  playButtonLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  contentContainer: {
    padding: 16,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 2,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  metaInfoSeparator: {
    color: "#fff",
    fontSize: fontSize.xs,
    marginHorizontal: 4,
  },
  ratingContainer: {
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  meta: {
    color: "#aaa",
    fontSize: 14,
  },
  tagline: {
    color: "#ccc",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 4,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  genreTag: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 5,
    marginBottom: 8,
  },
  genreText: {
    color: colors.primary,
    fontSize: fontSize.xs,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  overview: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  similarCard: {
    width: 140,
    marginRight: 12,
    marginBottom: 20,
  },
  similarPoster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  similarRating: {
    color: "#aaa",
    fontSize: 12,
  },
  watchlistButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    alignSelf: "flex-start",
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  watchlistButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  watchlistButtonText: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  watchlistButtonTextActive: {
    color: colors.background,
  },
});

export default MovieDetail;
