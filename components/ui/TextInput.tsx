import { colors } from "@/theme";
import React, { useState } from "react";
import { TextInput as RNTextInput, StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={styles.container}>
      <Text style={[styles.label]}>{label}</Text>
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        style={[
          styles.input,
          {
            borderColor: error
              ? colors.error
              : isFocused
              ? colors.primary
              : "#ccc",
          },
        ]}
      />
      {error && <Text style={[styles.error]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.text,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    color: colors.text,
  },
  error: {
    color: colors.error,
    marginTop: 4,
    fontSize: 13,
  },
});
