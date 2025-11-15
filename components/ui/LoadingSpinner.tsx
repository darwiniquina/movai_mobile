import { colors } from "@/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({
  size = 40,
  color = colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});
