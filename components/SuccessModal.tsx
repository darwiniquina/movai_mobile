import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

type SuccessModalProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  iconName?: keyof typeof MaterialIcons.glyphMap; // optional icon
};

export default function SuccessModal({
  visible,
  message,
  onClose,
  iconName = "check-circle",
}: SuccessModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <MaterialIcons
            name={iconName}
            size={60}
            color="#4BB543"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.message}>{message}</Text>
          <Button title="OK" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
