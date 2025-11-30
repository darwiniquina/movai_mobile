import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info" | "confirm";
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  colors?: {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  colors = {
    primary: "#4BB543",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#AAAAAA",
    border: "#333333",
    error: "#FF4D4F",
    warning: "#FFD700",
    success: "#4BB543",
  },
}) => {
  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          name: "checkmark-circle" as const,
          color: colors.success,
        };
      case "error":
        return {
          name: "close-circle" as const,
          color: colors.error,
        };
      case "warning":
        return {
          name: "warning" as const,
          color: colors.warning,
        };
      case "confirm":
        return {
          name: "help-circle" as const,
          color: colors.primary,
        };
      default:
        return {
          name: "information-circle" as const,
          color: colors.primary,
        };
    }
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const iconConfig = getIconConfig();
  const isConfirmModal = type === "confirm";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContainer, { backgroundColor: colors.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name={iconConfig.name}
              size={60}
              color={iconConfig.color}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

          {/* Message */}
          {message && (
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {message}
            </Text>
          )}

          {/* Actions */}
          <View style={styles.buttonContainer}>
            {isConfirmModal && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor:
                    type === "error"
                      ? colors.error
                      : type === "warning"
                      ? colors.warning
                      : colors.primary,
                },
                !isConfirmModal && { flex: 1 },
              ]}
              onPress={handleConfirm}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      type === "warning"
                        ? colors.background
                        : colors.background,
                  },
                ]}
              >
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // Will use backgroundColor from props
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomModal;
