import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import SectionHeader from "@/components/SectionHeader";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";
import { formatDate } from "@/utils/dates";
import { getFilterOptions, type EmployeeFilterType } from "@/utils/employeeFilters";

const TITLES: Record<EmployeeFilterType, string> = {
  position: "Odaberi poziciju",
  team: "Odaberi tim",
  arrival: "Odaberi grupu dolaska",
};

export default function FilterOptionsScreen() {
  const { filterType } = useLocalSearchParams<{ filterType: EmployeeFilterType }>();
  const { employees, loading, error } = useEmployees();

  const options = useMemo(
    () => (filterType ? getFilterOptions(employees, filterType) : []),
    [employees, filterType]
  );

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

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <BackButton />
        <SectionHeader title={filterType ? TITLES[filterType] : ""} />
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => item.value}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.option}
            onPress={() =>
              router.push({
                pathname: "/results",
                params: { filterType, filterValue: item.value },
              })
            }
          >
            <Text style={styles.label}>
              {filterType === "arrival" ? formatDate(item.value) : item.value}
            </Text>
            <Text style={styles.meta}>{item.count} ljudi</Text>
          </Pressable>
        )}
      />
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
  header: {
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
