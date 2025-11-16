import ContentCard from "@/components/ContentCard";
import ToggleTabs from "@/components/ui/ToggleTabs";
import { TMDB_PROFILE_BASE } from "@/constants/tmdb";
import { Person, PersonCredit } from "@/interfaces/Person";
import api from "@/services/api";
import readableDate from "@/services/readableDate";
import { borderRadius, colors, fontSize, spacing } from "@/theme";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const PersonDetail = () => {
  const router = useRouter();
  const route = useRoute();
  const { id } = route.params as { id: number };

  const [person, setPerson] = useState<Person | null>(null);
  const [movieCredits, setMovieCredits] = useState<PersonCredit[]>([]);
  const [tvCredits, setTvCredits] = useState<PersonCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"movies" | "tv">("movies");

  useEffect(() => {
    fetchPersonData();
  }, [id]);

  const fetchPersonData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/person/${id}`);

      console.log("Person Data:", JSON.stringify(response.data, null, 2));

      const personData = response.data.data;
      setPerson(personData);

      // Process movie credits
      if (personData.movie_credits) {
        const movies = [
          ...(personData.movie_credits.cast || []).map(
            (item: PersonCredit) => ({
              ...item,
              media_type: "movie",
            })
          ),
        ]
          .sort((a, b) => {
            const dateA = a.release_date || "0";
            const dateB = b.release_date || "0";
            return dateB.localeCompare(dateA);
          })
          .slice(0, 20);

        setMovieCredits(movies);
      }

      // Process TV credits
      if (personData.tv_credits) {
        const shows = [
          ...(personData.tv_credits.cast || []).map((item: PersonCredit) => ({
            ...item,
            media_type: "tv",
          })),
        ]
          .sort((a, b) => {
            const dateA = a.first_air_date || "0";
            const dateB = b.first_air_date || "0";
            return dateB.localeCompare(dateA);
          })
          .slice(0, 20);

        setTvCredits(shows);
      }
    } catch (error) {
      console.error("Error fetching person data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (item: PersonCredit) => {
    if (item.media_type === "movie") {
      router.push({
        pathname: "/movie/[id]",
        params: { id: item.id.toString() },
      });
    } else if (item.media_type === "tv") {
      router.push({
        pathname: "/tv/[id]",
        params: { id: item.id.toString() },
      });
    }
  };

  const calculateAge = (birthday: string, deathday?: string) => {
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!person) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Person not found</Text>
      </View>
    );
  }

  const displayedCredits = activeTab === "movies" ? movieCredits : tvCredits;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header with Profile Image */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri: person.profile_path
                ? TMDB_PROFILE_BASE + person.profile_path
                : "https://via.placeholder.com/500x750?text=No+Image",
            }}
            style={styles.profileImage}
          />
          <View style={styles.headerOverlay} />
        </View>

        {/* Person Info */}
        <View style={styles.contentContainer}>
          <View style={styles.headerSection}>
            <Image
              source={{
                uri: person.profile_path
                  ? TMDB_PROFILE_BASE + person.profile_path
                  : "https://via.placeholder.com/500x750?text=No+Image",
              }}
              style={styles.profileCard}
            />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{person.name}</Text>

              <View style={styles.metaInfo}>
                <Text style={styles.department}>
                  {person.known_for_department}
                </Text>
              </View>

              {person.birthday && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Age:</Text>
                  <Text style={styles.infoValue}>
                    {calculateAge(person.birthday, person.deathday)} years
                    {person.deathday && " (deceased)"}
                  </Text>
                </View>
              )}

              {person.place_of_birth && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Born:</Text>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {person.place_of_birth}
                  </Text>
                </View>
              )}

              {person.birthday && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Birthday:</Text>
                  <Text style={styles.infoValue}>
                    {readableDate(person.birthday)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Also Known As */}
          {person.also_known_as && person.also_known_as.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Also Known As</Text>
              <View style={styles.aliasContainer}>
                {person.also_known_as.slice(0, 5).map((alias, index) => (
                  <View key={index} style={styles.aliasTag}>
                    <Text style={styles.aliasText}>{alias}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Biography */}
          {person.biography && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Biography</Text>
              <Text style={styles.biography}>
                {person.biography || "No biography available."}
              </Text>
            </View>
          )}

          {/* Credits Toggle */}
          {(movieCredits.length > 0 || tvCredits.length > 0) && (
            <View style={styles.section}>
              <View style={styles.tabContainer}>
                <ToggleTabs
                  activeTab={activeTab}
                  onToggle={(tab: "movies" | "tv") => setActiveTab(tab)}
                  options={[
                    { key: "movies", label: "Movies" },
                    { key: "tv", label: "TV Shows" },
                  ]}
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {displayedCredits.map((item) => (
                  <ContentCard
                    key={`${item.id}-${item.media_type}`}
                    content={item}
                    onPress={handleCardPress}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  headerContainer: {
    position: "relative",
    height: 250,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  contentContainer: {
    padding: spacing.md,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: -80,
    marginBottom: spacing.md,
  },
  profileCard: {
    width: 120,
    height: 180,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
    borderWidth: 3,
    borderColor: colors.background,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "flex-end",
    paddingTop: 60,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  metaInfo: {
    marginBottom: spacing.md,
  },
  department: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: spacing.xs + 2,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: "600",
    marginRight: spacing.sm,
    minWidth: 70,
  },
  infoValue: {
    color: colors.text,
    fontSize: fontSize.sm,
    flex: 1,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  aliasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  aliasTag: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  aliasText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
  },
  biography: {
    color: colors.textSecondary,
    fontSize: fontSize.sm + 1,
    lineHeight: 22,
  },
  tabContainer: {
    marginBottom: spacing.md,
  },
});

export default PersonDetail;
