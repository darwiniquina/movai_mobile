import Button from "@/components/ui/Button";
import { AuthContext } from "@/lib/AuthContext";
import React, { useContext } from "react";
import { Text, View } from "react-native";

export default function Search() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome! You’re logged in 🎉</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
