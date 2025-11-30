import Button from "@/components/ui/Button";
import { colors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RegisterSuccess() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="mark-email-read"
            size={96}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>Welcome to Movai!</Text>

        <Text style={styles.subtitle}>
          Your account has been successfully created.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verify your email</Text>

          <Text style={styles.cardMessage}>
            Please check your inbox to verify your account.
          </Text>

          <View style={styles.spamRow}>
            <MaterialIcons
              name="info-outline"
              size={18}
              color={colors.textSecondary}
              style={{ marginRight: 8 }}
            />

            <Text style={styles.spamText}>
              Can't find it? Check your{" "}
              <Text style={styles.spamHighlight}>Spam</Text> or{" "}
              <Text style={styles.spamHighlight}>Junk</Text> folder.
            </Text>
          </View>
        </View>

        <Button
          title="Go to Login"
          style={styles.button}
          onPress={() => router.replace("/login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    marginBottom: 28,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },

  card: {
    width: "100%",
    backgroundColor: colors.card,
    padding: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 36,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },

  cardMessage: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 22,
  },

  spamRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  spamText: {
    fontSize: 14,
    color: colors.textSecondary,
    flexShrink: 1,
    textAlign: "center",
  },

  spamHighlight: {
    fontWeight: "600",
    color: colors.warning,
  },

  button: {
    width: "100%",
    marginTop: 10,
  },
});
