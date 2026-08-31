import { useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import EmptyState from "@/components/EmptyState";
import PersonCard from "@/components/PersonCard";
import SearchInput from "@/components/SearchInput";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";
import type { EmployeeFilterType } from "@/utils/employeeFilters";

const FIELD_BY_FILTER_TYPE: Record<EmployeeFilterType, "position" | "team" | "startDate"> = {
  position: "position",
  team: "team",
  arrival: "startDate",
};

export default function ResultsScreen() {
  const { filterType, filterValue } = useLocalSearchParams<{
    filterType?: EmployeeFilterType;
    filterValue?: string;
  }>();
  const { employees, loading, error } = useEmployees();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const field = filterType ? FIELD_BY_FILTER_TYPE[filterType] : undefined;
    return employees
      .filter((e) => !field || !filterValue || e[field] === filterValue)
      .filter((e) => {
        const query = search.trim().toLowerCase();
        if (!query) return true;
        const haystack = `${e.alias} ${e.firstName} ${e.lastName}`.toLowerCase();
        return haystack.includes(query);
      });
  }, [employees, filterType, filterValue, search]);

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
        <SearchInput value={search} onChangeText={setSearch} />
      </View>

      {filtered.length === 0 ? (
        <EmptyState message="Nema rezultata." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PersonCard
              employee={item}
              variant="grid"
              onPress={() => router.push({ pathname: "/person/[id]", params: { id: item.id } })}
            />
          )}
        />
      )}
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
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 10,
  },
  list: {
    padding: 12,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
});
