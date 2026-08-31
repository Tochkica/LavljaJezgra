import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { colors } from "@/theme/colors";

export default function BackButton() {
  if (!router.canGoBack()) return null;

  return (
    <Pressable style={styles.button} onPress={() => router.back()} hitSlop={12}>
      <Ionicons name="arrow-back" size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});
