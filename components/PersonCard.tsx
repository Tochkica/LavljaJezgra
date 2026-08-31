import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "@/theme/colors";
import type { Employee } from "@/hooks/useEmployees";

type Variant = "grid" | "compact";

interface Badge {
  text: string;
  bg: string;
  textColor: string;
}

interface PersonCardProps {
  employee: Employee;
  variant: Variant;
  badge?: Badge;
  subtitle?: string;
  onPress?: () => void;
}

export default function PersonCard({ employee, variant, badge, subtitle, onPress }: PersonCardProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !employee.photoUrl || imageError;
  const isGrid = variant === "grid";

  return (
    <Pressable
      onPress={onPress}
      style={isGrid ? styles.gridContainer : styles.compactContainer}
    >
      <View style={styles.photoWrapper}>
        {showFallback ? (
          <View style={[styles.photo, styles.photoFallback]}>
            <MaterialIcons name="person" size={isGrid ? 40 : 28} color={colors.textMuted} />
          </View>
        ) : (
          <Image
            source={{ uri: employee.photoUrl }}
            style={styles.photo}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}

        {variant === "compact" && badge ? (
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.textColor }]}>{badge.text}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.alias} numberOfLines={isGrid ? 1 : 2}>
        {employee.alias}
      </Text>

      {isGrid ? (
        <Text style={styles.meta} numberOfLines={1}>
          {employee.position} · {employee.team}
        </Text>
      ) : null}

      {!isGrid && subtitle ? (
        <Text style={styles.meta} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
  },
  compactContainer: {
    width: 82,
  },
  photoWrapper: {
    width: "100%",
    aspectRatio: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  photoFallback: {
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  alias: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
