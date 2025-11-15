import { colors } from "@/theme";
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />

        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen
          name="register-success"
          options={{ title: "Register Success" }}
        />
      </Stack>
    </AuthProvider>
  );
}
