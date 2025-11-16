import ContentCardSearch from "@/components/ContentCardSearch";
import ToggleTabs from "@/components/ui/ToggleTabs";
import { AiLimit, SearchResultItem } from "@/interfaces/Search";
import api from "@/services/api";
import { colors, fontSize } from "@/theme";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Search() {
  const [activeTab, setActiveTab] = useState<"search" | "ai">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLimit, setAiLimit] = useState<AiLimit | null>(null);
  const [loadingLimit, setLoadingLimit] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (activeTab === "ai") {
      fetchAiLimit();
    }
  }, [activeTab]);

  const fetchAiLimit = async () => {
    setLoadingLimit(true);
    try {
      const response = await api.get("/ai/limit");
      setAiLimit(response.data);
    } catch (error) {
      console.error("Error fetching AI limit:", error);
    } finally {
      setLoadingLimit(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    if (activeTab === "ai" && aiLimit && aiLimit.remaining <= 0) {
      return;
    }

    setLoading(true);
    try {
      const endpoint = activeTab === "search" ? "/search/multi" : "/ai/search";
      const response = await api.get(endpoint, { params: { query } });

      if (activeTab === "ai") {
        setResults(
          response.data?.data || response.data?.results || response.data || []
        );
      } else {
        setResults(response.data?.data?.results || []);
      }

      if (activeTab === "ai") {
        fetchAiLimit();
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: SearchResultItem }) => (
    <ContentCardSearch
      key={item.id}
      item={item}
      onPress={(selectedItem) => {
        if (selectedItem.media_type === "movie") {
          router.push({
            pathname: "/movie/[id]",
            params: { id: selectedItem.id.toString() },
          });
        } else if (selectedItem.media_type === "tv") {
          router.push({
            pathname: "/tv/[id]",
            params: { id: selectedItem.id.toString() },
          });
        } else {
          console.log("Clicked person (not implemented yet):", selectedItem);
        }
      }}
    />
  );

  const isAiSearchDisabled =
    activeTab === "ai" && aiLimit && aiLimit.remaining <= 0;

  return (
    <SafeAreaView style={styles.container}>
      <ToggleTabs
        activeTab={activeTab}
        onToggle={(tab: "search" | "ai") => setActiveTab(tab)}
        options={[
          {
            key: "search",
            label: "Search",
            icon: (
              <Feather
                name="search"
                size={20}
                color={activeTab === "search" ? colors.primary : colors.text}
              />
            ),
          },
          {
            key: "ai",
            label: "AI Search",
            icon: (
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={activeTab === "ai" ? colors.primary : colors.text}
              />
            ),
          },
        ]}
      />

      {/* AI Limit Display */}
      {activeTab === "ai" && (
        <View style={styles.limitContainer}>
          {loadingLimit ? (
            <ActivityIndicator size="small" color="#888" />
          ) : aiLimit ? (
            <>
              <View style={styles.limitInfo}>
                <Text style={styles.limitText}>
                  AI Searches: {aiLimit.remaining} / {aiLimit.limit} remaining
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(aiLimit.remaining / aiLimit.limit) * 100}%`,
                        backgroundColor:
                          aiLimit.remaining > 0 ? "#4CAF50" : "#f44336",
                      },
                    ]}
                  />
                </View>
              </View>
              {aiLimit.remaining === 0 && (
                <Text style={styles.refillText}>
                  Limit reached. Refills tomorrow
                </Text>
              )}
            </>
          ) : null}
        </View>
      )}

      {/* Search suggestions */}
      {activeTab === "search" && results.length === 0 && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>What can you search?</Text>
          <View style={styles.suggestionChips}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>🎬 Movies</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>📺 TV Series</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>👤 People</Text>
            </View>
          </View>
          <Text style={styles.suggestionSubtext}>
            Try searching for titles, actors, directors, or genres
          </Text>
        </View>
      )}

      {activeTab === "ai" && results.length === 0 && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>AI-Powered Search</Text>
          <Text style={styles.suggestionSubtext}>
            Ask questions naturally like:
          </Text>
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleText}>
              • "Show me action movies from the 90s"
            </Text>
            <Text style={styles.exampleText}>
              • "Movies similar to Inception"
            </Text>
            <Text style={styles.exampleText}>
              • "Best sci-fi TV series to watch"
            </Text>
          </View>
        </View>
      )}

      {/* Search input with button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={
            activeTab === "search"
              ? "Search movies, TV series, people..."
              : "Ask AI anything about movies or TV..."
          }
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          editable={!isAiSearchDisabled}
        />
        <TouchableOpacity
          style={[
            styles.searchButton,
            isAiSearchDisabled && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={!!isAiSearchDisabled}
        >
          <Feather name="search" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && <ActivityIndicator size="large" color="#fff" />}

      {/* Results */}
      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Placeholder for empty AI search */}
      {!loading &&
        results.length === 0 &&
        activeTab === "ai" &&
        query.trim() !== "" && (
          <View style={styles.placeholder}>
            <Text style={{ color: "#888" }}>
              {isAiSearchDisabled
                ? "No AI searches remaining. Check back tomorrow!"
                : "No results found. Try rephrasing your question."}
            </Text>
          </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    gap: 10,
  },
  toggleContainer: {
    marginVertical: 16,
  },
  limitContainer: {
    backgroundColor: "#1a1a1a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  limitInfo: {
    marginBottom: 8,
  },
  limitText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  refillText: {
    color: "#fc8727ff",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 80,
    maxHeight: 120,
  },
  searchButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  searchButtonDisabled: {
    backgroundColor: "#1a1a1a",
    opacity: 0.5,
  },
  placeholder: {
    marginTop: 50,
    alignItems: "center",
  },
  suggestionsContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  suggestionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  suggestionChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  chipText: {
    color: "#fff",
    fontSize: fontSize.xs,
  },
  suggestionSubtext: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    lineHeight: 20,
  },
  exampleContainer: {
    marginTop: 12,
    paddingLeft: 8,
  },
  exampleText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
