import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
