import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Pressable,
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    View,
} from "react-native";

type TextInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  textAlignVertical?: "top" | "bottom";
};

export default function TextInput({
  label,
  value,
  placeholder = "",
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  textAlignVertical = "top",
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label]}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          {
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : "#ccc",
          },
        ]}
      >
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          style={styles.input}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={[styles.error]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderRadius: 12,
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    height: "100%",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  error: {
    color: colors.error,
    marginTop: 4,
    fontSize: 13,
  },
});
