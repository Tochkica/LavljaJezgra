import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";
import { useEmployees } from "@/hooks/useEmployees";
import { colors } from "@/theme/colors";

export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employees, loading, error } = useEmployees();
  const [imageError, setImageError] = useState(false);

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

  const employee = employees.find((e) => e.id === id);

  if (!employee) {
    return (
      <SafeAreaView style={styles.center}>
        <BackButton />
        <Text style={styles.info}>Osoba nije pronađena.</Text>
      </SafeAreaView>
    );
  }

  const showFallback = !employee.photoUrl || imageError;

  const rows: [string, string][] = [
    ["Pozicija", employee.position],
    ["Tim", employee.team],
    ["Datum dolaska", employee.startDate],
    ["Rođendan", employee.birthday],
  ];

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <BackButton />

      <View style={styles.photoWrapper}>
        {showFallback ? (
          <View style={[styles.photo, styles.photoFallback]}>
            <MaterialIcons name="person" size={72} color={colors.textMuted} />
          </View>
        ) : (
          <Image
            source={{ uri: employee.photoUrl }}
            style={styles.photo}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      <Text style={styles.alias}>{employee.alias}</Text>
      <Text style={styles.realName}>
        {employee.firstName} {employee.lastName}
      </Text>

      <View style={styles.card}>
        {rows.map(([label, value], index) => (
          <View
            key={label}
            style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
          >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || "-"}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
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
  photoWrapper: {
    width: "60%",
    alignSelf: "center",
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
  alias: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },
  realName: {
    marginTop: 2,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  card: {
    marginTop: 24,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
});
