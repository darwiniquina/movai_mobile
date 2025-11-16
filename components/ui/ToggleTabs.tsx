import { colors, fontSize } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type TabOption<T extends string> = {
  key: T;
  label: string;
  icon?: React.ReactNode;
};

interface ToggleTabsProps<T extends string> {
  activeTab: T;
  onToggle: (tabKey: T) => void;
  options?: TabOption<T>[];
}

function ToggleTabs<T extends string>({
  activeTab,
  onToggle,
  options = [
    { key: "movies" as T, label: "Movies" },
    { key: "tv" as T, label: "TV Shows" },
  ],
}: ToggleTabsProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = activeTab === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            style={styles.tab}
            onPress={() => onToggle(option.key)}
          >
            {option.icon && (
              <View style={styles.iconContainer}>{option.icon}</View>
            )}
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default ToggleTabs;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  tabText: {
    fontSize: fontSize.sm,
    fontWeight: "bold",
    color: colors.text,
  },

  activeTabText: {
    color: colors.primary,
  },
});
