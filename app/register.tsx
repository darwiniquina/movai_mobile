import EmojiProfile from "@/components/EmojiProfile";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { colors, fontSize } from "@/theme";
import { router } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../lib/AuthContext";

export default function Register() {
  const { register, errors, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [bio, setBio] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [emoji_avatar, setProfileEmoji] = useState("🎬");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 20,
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <EmojiProfile
            selectedEmoji={emoji_avatar}
            onEmojiSelect={setProfileEmoji}
            size={100}
            colors={colors}
          />

          <Text
            style={{
              fontSize: fontSize.xxl,
              fontWeight: "bold",
              marginBottom: 15,
              color: colors.primary,
            }}
          >
            Register
            <Text style={{ fontSize: fontSize.md, color: colors.text }}>
              {" "}
              your account
            </Text>
          </Text>

          <TextInput
            label="Email *"
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <TextInput
            label="Name *"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <TextInput
            label="Username *"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
          />

          <TextInput
            label="Password *"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <TextInput
            label="Password confirmation *"
            placeholder="••••••••"
            value={password_confirmation}
            onChangeText={setPasswordConfirmation}
            secureTextEntry
            error={errors.password_confirmation}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color="#0000ff"
              style={{ marginBottom: 10 }}
            />
          )}

          <Button
            title={loading ? "Processing..." : "Register"}
            style={{ width: "100%" }}
            onPress={() =>
              register(
                name,
                username,
                display_name,
                bio,
                email,
                password,
                password_confirmation,
                emoji_avatar
              )
            }
          />

          <Pressable onPress={() => router.push("/login")}>
            <Text
              style={{
                marginTop: 20,
                color: colors.textSecondary,
                textAlign: "center",
              }}
            >
              Already have an account? Login here
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
