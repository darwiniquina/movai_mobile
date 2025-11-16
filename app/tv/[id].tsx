import CastCard from "@/components/CastCard";
import ContentCard from "@/components/ContentCard";
import { TMDB_IMAGE_BASE } from "@/constants/tmdb";
import { Cast } from "@/interfaces/Cast";
import { Movie } from "@/interfaces/Movie";
import { PersonCredit } from "@/interfaces/Person";
import { Tv } from "@/interfaces/Tv";
import { Video } from "@/interfaces/Video";
import readableDate from "@/services//readableDate";
import api from "@/services/api";

import { colors, fontSize } from "@/theme";
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

const TvDetail = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: number };
  const playerRef = useRef(null);

  const [Tv, setTv] = useState<Tv | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<Tv[]>([]);
  const [recommended, setRecommended] = useState<Tv[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchTvData();
  }, [id]);

  const fetchTvData = async () => {
    try {
      setLoading(true);
      const [TvRes, similarRes] = await Promise.all([
        api.get(`/tv/${id}`),
        api.get(`/tv/${id}/similar`),
      ]);

      const TvData = TvRes.data.data;
      const similarData = similarRes.data.data;

      setTv(TvData);
      setSimilar(similarData.results || []);

      if (TvData.credits?.cast) {
        setCast(TvData.credits.cast.slice(0, 10));
      }

      if (TvData.videos?.results) {
        const trailerVideo =
          TvData.videos.results.find(
            (video: Video) =>
              video.type === "Trailer" &&
              video.site === "YouTube" &&
              video.official
          ) ||
          TvData.videos.results.find(
            (video: Video) =>
              video.type === "Trailer" && video.site === "YouTube"
          );
        setTrailer(trailerVideo || null);
      }
    } catch (error) {
      console.error("Error fetching Tv data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePlayer = () => {
    setPlaying(false);
  };

  const handlePlayTrailer = () => {
    setPlaying(true);
  };

  const handleCardPress = (item: Movie | Tv | PersonCredit) => {
    router.push({
      pathname: "/tv/[id]",
      params: { id: item.id.toString() },
    });
  };

  const handleCastPress = (person: Cast) => {
    router.push({
      pathname: "/person/[id]",
      params: { id: person.id.toString() },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!Tv) {
    return null;
  }

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
                  uri: Tv.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${Tv.backdrop_path}`
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

        {/* Tv Info */}
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Image
              source={{
                uri: TMDB_IMAGE_BASE + Tv.poster_path,
              }}
              style={styles.poster}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{Tv.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.tagline}>"{Tv.tagline || ""}"</Text>

                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>
                    ⭐ {Tv.vote_average.toFixed(1)}
                  </Text>
                </View>
                <Text style={styles.metaInfoSeparator}>•</Text>
                <Text style={styles.meta}>Tv</Text>
                <Text style={styles.metaInfoSeparator}>•</Text>
                <Text style={styles.meta}>{Tv.runtime} min</Text>
              </View>

              <Text style={styles.meta}>
                Realesed on {readableDate(Tv.release_date)}
              </Text>

              {/* Genres */}
              {Tv.genres && Tv.genres.length > 0 && (
                <View style={styles.genresContainer}>
                  {Tv.genres.map((genre) => (
                    <View key={genre.id} style={styles.genreTag}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{Tv.overview}</Text>
          </View>

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

          {/* Similar Series */}
          <Text style={styles.sectionTitle}>Similar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similar.map((item) => (
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
  castCard: {
    width: 100,
    marginRight: 12,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  castName: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  castCharacter: {
    color: "#aaa",
    fontSize: 12,
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
});

export default TvDetail;
