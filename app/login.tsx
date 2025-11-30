import TextInput from "@/components/ui/TextInput";
import { colors, fontSize } from "@/theme";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
} from "react-native";
import Button from "../components/ui/Button";
import { AuthContext } from "../lib/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, errors, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: fontSize.xxl,
            fontWeight: "bold",
            marginBottom: 15,
            color: colors.primary,
          }}
        >
          Login
          <Text style={{ fontSize: fontSize.md, color: colors.text }}>
            {" "}
            to your account
          </Text>
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        {errors.general && (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {errors.general}
          </Text>
        )}

        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ marginBottom: 10 }}
          />
        )}

        <Button
          title={loading ? "Processing..." : "Login"}
          onPress={() => login(email, password)}
          disabled={loading}
          style={{ width: "100%" }}
        />

        <Pressable onPress={() => router.push("/register")}>
          <Text
            style={{
              marginTop: 20,
              color: colors.textSecondary,
              textAlign: "center",
            }}
          >
            Don't have an account? Sign up here
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
