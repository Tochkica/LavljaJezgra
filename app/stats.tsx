import { useMemo } from "react";
import { router } from "expo-router";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import PersonCard from "@/components/PersonCard";
import SectionHeader from "@/components/SectionHeader";
import StatBar from "@/components/StatBar";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";
import { formatDate, yearsAtCompany } from "@/utils/dates";
import { getFilterOptions } from "@/utils/employeeFilters";

export default function StatsScreen() {
  const { employees, loading, error } = useEmployees();

  const totalCount = employees.length;

  const teamBars = useMemo(
    () => [...getFilterOptions(employees, "team")].sort((a, b) => b.count - a.count),
    [employees]
  );
  const maxTeamCount = teamBars[0]?.count ?? 0;

  const positionBars = useMemo(
    () => [...getFilterOptions(employees, "position")].sort((a, b) => b.count - a.count),
    [employees]
  );
  const maxPositionCount = positionBars[0]?.count ?? 0;

  const avgTenure = useMemo(() => {
    const withStart = employees.filter((e) => e.startDate);
    if (withStart.length === 0) return null;
    return withStart.reduce((sum, e) => sum + yearsAtCompany(e.startDate), 0) / withStart.length;
  }, [employees]);

  const longestTenured = useMemo(() => {
    const withStart = employees.filter((e) => e.startDate);
    if (withStart.length === 0) return [];
    const earliest = withStart.reduce(
      (min, e) => (e.startDate < min ? e.startDate : min),
      withStart[0].startDate
    );
    return withStart.filter((e) => e.startDate === earliest);
  }, [employees]);

  const currentYear = new Date().getFullYear();
  const joinedThisYear = useMemo(
    () =>
      employees.filter((e) => e.startDate && Number(e.startDate.slice(0, 4)) === currentYear)
        .length,
    [employees, currentYear]
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackButton />

        <View style={styles.headlineRow}>
          <View style={styles.headlineCard}>
            <Text style={styles.headlineValue}>{totalCount}</Text>
            <Text style={styles.headlineLabel}>Ukupno zaposlenika</Text>
          </View>
          <View style={styles.headlineCard}>
            <Text style={styles.headlineValue}>
              {avgTenure !== null ? avgTenure.toFixed(1) : "–"}
            </Text>
            <Text style={styles.headlineLabel}>Prosječan staž (god.)</Text>
          </View>
          <View style={styles.headlineCard}>
            <Text style={styles.headlineValue}>{joinedThisYear}</Text>
            <Text style={styles.headlineLabel}>Došlo ove godine</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Po timu" />
          {teamBars.length > 0 ? (
            <View style={styles.barList}>
              {teamBars.map((item) => (
                <StatBar
                  key={item.value}
                  label={item.value}
                  count={item.count}
                  percentage={maxTeamCount > 0 ? (item.count / maxTeamCount) * 100 : 0}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.info}>Nema podataka.</Text>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Po poziciji" />
          {positionBars.length > 0 ? (
            <View style={styles.barList}>
              {positionBars.map((item) => (
                <StatBar
                  key={item.value}
                  label={item.value}
                  count={item.count}
                  percentage={maxPositionCount > 0 ? (item.count / maxPositionCount) * 100 : 0}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.info}>Nema podataka.</Text>
          )}
        </View>

        <View style={styles.section}>
          <SectionHeader title="Najdulje u firmi" />
          {longestTenured.length > 0 ? (
            <FlatList
              data={longestTenured}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <PersonCard
                  employee={item}
                  variant="compact"
                  badge={{
                    text: `${yearsAtCompany(item.startDate)} god`,
                    bg: colors.purple,
                    textColor: "#FFFFFF",
                  }}
                  subtitle={formatDate(item.startDate)}
                  onPress={() =>
                    router.push({ pathname: "/person/[id]", params: { id: item.id } })
                  }
                />
              )}
            />
          ) : (
            <Text style={styles.info}>Nema podataka.</Text>
          )}
        </View>
      </ScrollView>
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
    color: colors.textMuted,
  },
  scroll: {
    padding: 16,
  },
  headlineRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  headlineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  headlineValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  headlineLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  barList: {
    gap: 14,
  },
  horizontalList: {
    gap: 12,
  },
});
