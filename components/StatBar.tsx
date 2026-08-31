import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

interface StatBarProps {
  label: string;
  count: number;
  percentage: number;
}

export default function StatBar({ label, count, percentage }: StatBarProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.count}>{count}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    flexShrink: 1,
    marginRight: 8,
  },
  count: {
    fontSize: 13,
    color: colors.textMuted,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.blue,
  },
});
