import { useMemo, useState } from "react";
import { router } from "expo-router";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

import BackButton from "@/components/BackButton";
import PersonCard from "@/components/PersonCard";
import SectionHeader from "@/components/SectionHeader";
import { CURRENT_USER_ID } from "@/config";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";
import {
  daysUntilAnniversary,
  formatBirthday,
  formatDate,
  isAnniversaryThisMonthOrSoon,
  upcomingAnniversaryMilestone,
} from "@/utils/dates";

export default function HomeScreen() {
  const { employees, loading, error } = useEmployees();
  const [avatarError, setAvatarError] = useState(false);

  const currentUser = useMemo(
    () => employees.find((e) => e.id === CURRENT_USER_ID),
    [employees]
  );

  const newest = useMemo(() => {
    const withStartDate = employees.filter((e) => e.startDate);
    if (withStartDate.length === 0) return [];
    const latestDate = withStartDate.reduce(
      (max, e) => (e.startDate > max ? e.startDate : max),
      withStartDate[0].startDate
    );
    return withStartDate.filter((e) => e.startDate === latestDate);
  }, [employees]);

  const upcomingAnniversaries = useMemo(
    () =>
      employees
        .filter((e) => e.startDate && isAnniversaryThisMonthOrSoon(e.startDate, 10))
        .sort((a, b) => daysUntilAnniversary(a.startDate) - daysUntilAnniversary(b.startDate)),
    [employees]
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

  const showAvatarFallback = !currentUser?.photoUrl || avatarError;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <BackButton />

        <View style={styles.greeting}>
          <Text style={styles.greetingText}>
            Bok, {currentUser?.alias ?? "..."}
          </Text>

          <Pressable
            style={styles.avatar}
            onPress={() =>
              router.push({ pathname: "/person/[id]", params: { id: CURRENT_USER_ID } })
            }
          >
            {showAvatarFallback ? (
              <View style={[styles.avatarImage, styles.avatarFallback]}>
                <MaterialIcons name="person" size={64} color={colors.textMuted} />
              </View>
            ) : (
              <Image
                source={{ uri: currentUser?.photoUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
                onError={() => setAvatarError(true)}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Novi u firmi" />
          {newest.length > 0 ? (
            <Text style={styles.sectionSubtitle}>
              Datum dolaska: {formatDate(newest[0].startDate)}
            </Text>
          ) : null}
          <FlatList
            data={newest}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item }) => (
              <PersonCard
                employee={item}
                variant="compact"
                onPress={() => router.push({ pathname: "/person/[id]", params: { id: item.id } })}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Nadolazeće godišnjice ovaj mjesec" />
          {upcomingAnniversaries.length === 0 ? (
            <Text style={styles.sectionSubtitle}>Nitko ovaj mjesec.</Text>
          ) : (
            <FlatList
              data={upcomingAnniversaries}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <PersonCard
                  employee={item}
                  variant="compact"
                  badge={{
                    text: `${upcomingAnniversaryMilestone(item.startDate)} god`,
                    bg: colors.purple,
                    textColor: "#FFFFFF",
                  }}
                  subtitle={formatBirthday(item.startDate)}
                  onPress={() =>
                    router.push({ pathname: "/person/[id]", params: { id: item.id } })
                  }
                />
              )}
            />
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
  greeting: {
    alignItems: "center",
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
  },
  horizontalList: {
    gap: 12,
  },
});
