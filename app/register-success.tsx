import Button from "@/components/ui/Button";
import { colors } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RegisterSuccess() {
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="check-circle"
        size={100}
        color={colors.primary}
        style={{ marginBottom: 30 }}
      />
      <Text style={styles.title}>Congratulations!</Text>
      <Text style={styles.message}>
        Almost there. Please check your email to verify your account before
        logging in.
      </Text>
      <Button
        title="Go to Login"
        style={{ width: "100%" }}
        onPress={() => router.replace("/login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: colors.text,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
});
