import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmojiAvatarProps {
  emoji: string;
  size?: number;
  colors?: {
    primary: string;
    card: string;
    border: string;
  };
}

const EmojiAvatar: React.FC<EmojiAvatarProps> = ({
  emoji,
  size = 80,
  colors = {
    primary: "#4BB543",
    card: "#1E1E1E",
    border: "#333333",
  },
}) => {
  return (
    <View
      style={[
        styles.emojiButton,
        {
          width: size,
          height: size,
          backgroundColor: colors.card,
          borderColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.emojiDisplay, { fontSize: size * 0.6 }]}>
        {emoji}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emojiButton: {
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiDisplay: {
    textAlign: "center",
  },
});

export default EmojiAvatar;
