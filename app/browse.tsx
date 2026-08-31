import { useMemo } from "react";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";

export default function BrowseScreen() {
  const { employees, loading, error } = useEmployees();

  const counts = useMemo(() => {
    const positions = new Set(employees.map((e) => e.position).filter(Boolean));
    const teams = new Set(employees.map((e) => e.team).filter(Boolean));
    const arrivalGroups = new Set(employees.map((e) => e.startDate).filter(Boolean));
    return {
      all: employees.length,
      positions: positions.size,
      teams: teams.size,
      arrivalGroups: arrivalGroups.size,
    };
  }, [employees]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <BackButton />
        <Text style={styles.info}>Učitavanje...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <BackButton />
        <Text style={styles.info}>Greška: {error}</Text>
      </SafeAreaView>
    );
  }

  const options = [
    {
      label: "Svi zaposlenici",
      meta: `${counts.all} ljudi`,
      onPress: () => router.push({ pathname: "/results", params: {} }),
    },
    {
      label: "Po poziciji",
      meta: `${counts.positions} pozicija`,
      onPress: () =>
        router.push({ pathname: "/filter-options", params: { filterType: "position" } }),
    },
    {
      label: "Po timu",
      meta: `${counts.teams} tima`,
      onPress: () => router.push({ pathname: "/filter-options", params: { filterType: "team" } }),
    },
    {
      label: "Grupe po dolasku",
      meta: `${counts.arrivalGroups} grupa`,
      onPress: () =>
        router.push({ pathname: "/filter-options", params: { filterType: "arrival" } }),
    },
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.headerRow}>
        <BackButton />
      </View>

      <View style={styles.list}>
        {options.map((option) => (
          <Pressable key={option.label} style={styles.option} onPress={option.onPress}>
            <Text style={styles.label}>{option.label}</Text>
            <Text style={styles.meta}>{option.meta}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  info: {
    color: colors.text,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
