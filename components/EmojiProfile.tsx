import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const EMOJI_CATEGORIES = {
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
  ],
  Animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
  ],
  Food: [
    "🍎",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶",
    "🌽",
    "🥕",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🥞",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🦴",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🥪",
    "🥙",
    "🌮",
    "🌯",
    "🥗",
    "🥘",
    "🍝",
  ],
  Nature: [
    "🌸",
    "🌺",
    "🌻",
    "🌷",
    "🌹",
    "🥀",
    "🌼",
    "🌱",
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌾",
    "🌿",
    "☘️",
    "🍀",
    "🍁",
    "🍂",
    "🍃",
    "🌍",
    "🌎",
    "🌏",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌙",
    "⭐",
    "🌟",
    "✨",
    "⚡",
    "🔥",
    "💧",
    "🌊",
    "🌈",
    "☀️",
    "🌤",
    "⛅",
    "🌥",
    "☁️",
    "🌦",
    "🌧",
    "⛈",
    "🌩",
    "❄️",
    "☃️",
  ],
  Objects: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🥅",
    "⛳",
    "🎯",
    "🎮",
    "🕹",
    "🎲",
    "🎰",
    "🎸",
    "🎹",
    "🎺",
    "🎻",
    "🥁",
    "🎤",
    "🎧",
    "🎬",
    "🎨",
    "🎭",
    "🎪",
    "🎟",
    "🎫",
    "🎖",
    "🏆",
    "🥇",
    "🥈",
    "🥉",
    "⚾",
    "🏅",
    "🎗",
    "🏵",
    "🎀",
    "🎁",
    "💎",
    "💍",
    "👑",
  ],
};

interface EmojiProfileProps {
  selectedEmoji?: string;
  onEmojiSelect: (emoji: string) => void;
  size?: number;
  colors?: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

const EmojiProfile: React.FC<EmojiProfileProps> = ({
  selectedEmoji = "🎬",
  onEmojiSelect,
  size = 80,
  colors = {
    primary: "#4BB543",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#AAAAAA",
    border: "#333333",
  },
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<keyof typeof EMOJI_CATEGORIES>("Smileys");

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.emojiButton,
          {
            width: size,
            height: size,
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.emojiDisplay, { fontSize: size * 0.6 }]}>
          {selectedEmoji}
        </Text>
        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.editIcon}>✏️</Text>
        </View>
      </Pressable>

      <Text style={[styles.helperText, { color: colors.textSecondary }]}>
        Tap to change
      </Text>

      {/* Emoji Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {/* Header */}
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Choose Your Profile Emoji
              </Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[
                  styles.closeButton,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>
                  ✕
                </Text>
              </Pressable>
            </View>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryContainer}
              contentContainerStyle={styles.categoryContent}
            >
              {(
                Object.keys(EMOJI_CATEGORIES) as Array<
                  keyof typeof EMOJI_CATEGORIES
                >
              ).map((category) => (
                <Pressable
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor:
                        activeCategory === category
                          ? colors.primary
                          : colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color:
                          activeCategory === category
                            ? colors.background
                            : colors.text,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Emoji Grid */}
            <ScrollView style={styles.emojiGrid}>
              <View style={styles.emojiGridContent}>
                {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handleEmojiSelect(emoji)}
                    style={[
                      styles.emojiItem,
                      {
                        backgroundColor:
                          selectedEmoji === emoji
                            ? colors.primary + "20"
                            : "transparent",
                        borderColor:
                          selectedEmoji === emoji
                            ? colors.primary
                            : "transparent",
                      },
                    ]}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 10,
  },
  emojiButton: {
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  emojiDisplay: {
    textAlign: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#121212",
  },
  editIcon: {
    fontSize: 14,
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: "70%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoryContainer: {
    maxHeight: 35,
    marginVertical: 15,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emojiGrid: {
    flex: 1,
    paddingHorizontal: 10,
  },
  emojiGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 20,
  },
  emojiItem: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 12,
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 36,
  },
});

export default EmojiProfile;
