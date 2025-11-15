import React, { useContext } from "react";
import { Button, Text, View } from "react-native";
import { AuthContext } from "../lib/AuthContext";

export default function Index() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome! You’re logged in 🎉</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
