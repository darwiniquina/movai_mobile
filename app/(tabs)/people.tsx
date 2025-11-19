import api from "@/services/api";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounceTimer = useRef(null);

  const handleSearch = (text) => {
    setLoading(true);
    setQuery(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setResults([]);
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
        setLoading(false);
      }
    }, 300);
  };

  const handleItemPress = (item) => {
    router.push("/profile/" + item.id);
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userRow}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color={colors.textSecondary} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.displayName}>{item.display_name}</Text>
        <Text style={{ color: "#888", fontSize: 12 }}>{item.bio}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for people"
        placeholderTextColor="#777"
        value={query}
        onChangeText={handleSearch}
      />

      {loading && <ActivityIndicator size="small" color="#888" />}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 16,
  },

  input: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 45,
    backgroundColor: "#333",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  userInfo: {
    flexDirection: "column",
  },

  username: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  displayName: {
    color: "#888",
    fontSize: 13,
  },
});
