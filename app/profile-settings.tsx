import CustomModal from "@/components/CustomModal";
import EmojiProfile from "@/components/EmojiProfile";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { AuthContext } from "@/lib/AuthContext";
import api from "@/services/api";
import { colors, fontSize, spacing } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type UserProfile = {
  id: number;
  name: string;
  username: string;
  bio: string | null;
  public_profile: boolean;
  emoji_avatar: string;
  email: string;
  email_verified_at: string | null;
  to_watch_count: number;
  completed_count: number;
  created_at: string;
  updated_at: string;
};

type ModalState = {
  visible: boolean;
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
};

export default function ProfileSettings() {
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "security">(
    "profile"
  );

  const [modal, setModal] = useState<ModalState>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    emoji_avatar: "🎬",
    public_profile: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        bio: user.bio || "",
        emoji_avatar: user.emoji_avatar || "🎬",
        public_profile: user.public_profile,
      });
    }
  }, [user]);

  const showModal = (
    type: ModalState["type"],
    title: string,
    message: string,
    onConfirm?: () => void
  ) => {
    setModal({
      visible: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showModal("error", "Error", "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const response = await api.post("/user", profileForm);
      setUser(response.data.user);
      showModal(
        "success",
        "Success",
        "Your profile has been updated successfully!"
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      showModal(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.password !== passwordForm.password_confirmation) {
      showModal(
        "error",
        "Password Mismatch",
        "The passwords you entered do not match. Please try again."
      );
      return;
    }

    if (passwordForm.password.length < 8) {
      showModal(
        "error",
        "Invalid Password",
        "Password must be at least 8 characters long."
      );
      return;
    }

    try {
      setUpdating(true);
      await api.post("/user/password", passwordForm);

      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

      showModal(
        "success",
        "Success",
        "Your password has been updated successfully!"
      );
    } catch (error: any) {
      console.error("Error updating password:", error);
      showModal(
        "error",
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update password. Please check your current password."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    showModal("confirm", "Logout", "Are you sure you want to logout?", logout);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Navigation Tabs */}
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[
              styles.navItem,
              activeSection === "profile" && styles.navItemActive,
            ]}
            onPress={() => setActiveSection("profile")}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={
                activeSection === "profile"
                  ? colors.primary
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                activeSection === "profile" && styles.navTextActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navItem,
              activeSection === "security" && styles.navItemActive,
            ]}
            onPress={() => setActiveSection("security")}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={
                activeSection === "security"
                  ? colors.primary
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                activeSection === "security" && styles.navTextActive,
              ]}
            >
              Security
            </Text>
          </TouchableOpacity>
        </View>

        {activeSection === "profile" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Information</Text>

            {/* Emoji Profile Picker */}
            <View style={styles.emojiContainer}>
              <Text style={styles.emojiLabel}>Profile Avatar</Text>
              <EmojiProfile
                selectedEmoji={profileForm.emoji_avatar}
                onEmojiSelect={(emoji) =>
                  setProfileForm((prev) => ({ ...prev, emoji_avatar: emoji }))
                }
                size={100}
                colors={colors}
              />
            </View>

            <TextInput
              label="Display Name"
              value={profileForm.name}
              onChangeText={(text) =>
                setProfileForm((prev) => ({ ...prev, name: text }))
              }
              placeholder="Enter your display name"
            />

            <TextInput
              label="Bio"
              value={profileForm.bio}
              onChangeText={(text) =>
                setProfileForm((prev) => ({ ...prev, bio: text }))
              }
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.switchContainer}>
              <View style={styles.switchText}>
                <Text style={styles.switchLabel}>Public Profile</Text>
                <Text style={styles.switchDescription}>
                  Allow others to see your profile and watchlist
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.switch,
                  profileForm.public_profile && styles.switchActive,
                ]}
                onPress={() =>
                  setProfileForm((prev) => ({
                    ...prev,
                    public_profile: !prev.public_profile,
                  }))
                }
              >
                <View
                  style={[
                    styles.switchThumb,
                    profileForm.public_profile && styles.switchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <Button
              title="Save Changes"
              onPress={handleUpdateProfile}
              loading={updating}
              style={styles.saveButton}
            />
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Change Password</Text>

            <TextInput
              label="Current Password"
              value={passwordForm.current_password}
              onChangeText={(text) =>
                setPasswordForm((prev) => ({ ...prev, current_password: text }))
              }
              placeholder="Enter your current password"
              secureTextEntry
            />

            <TextInput
              label="New Password"
              value={passwordForm.password}
              onChangeText={(text) =>
                setPasswordForm((prev) => ({ ...prev, password: text }))
              }
              placeholder="Enter your new password"
              secureTextEntry
            />

            <TextInput
              label="Confirm New Password"
              value={passwordForm.password_confirmation}
              onChangeText={(text) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  password_confirmation: text,
                }))
              }
              placeholder="Confirm your new password"
              secureTextEntry
            />

            <Button
              title="Update Password"
              onPress={handleUpdatePassword}
              loading={updating}
              style={styles.saveButton}
            />
          </View>
        )}

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>@{user?.username}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </View>
      </ScrollView>

      {/* Custom Modal */}
      <CustomModal
        visible={modal.visible}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm}
        colors={colors}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colors.text,
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  navContainer: {
    flexDirection: "row",
    margin: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  navItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navText: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  navTextActive: {
    color: colors.background,
  },
  section: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: 12,
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  emojiContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
  },
  emojiLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  switchText: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  switch: {
    width: 50,
    height: 28,
    backgroundColor: colors.border,
    borderRadius: 14,
    padding: 2,
    justifyContent: "center",
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  logoutButton: {
    borderColor: colors.error,
    backgroundColor: colors.error + "20",
  },
  logoutText: {
    color: colors.error,
  },
});
