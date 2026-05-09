import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useCountries, useFilteredCountries } from "../hooks/useCountries";
import { CountryCard } from "../components/CountryCard";
import { SearchBar } from "../components/SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, ErrorMessage, LoadingIndicator } from "@/components";
import { useOnlineStatus } from "../context/OnlineContext";

type Props = NativeStackScreenProps<RootStackParamList, "Countries">;

export const CountriesScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error, refetch, isPending } = useCountries();
  const isOnline = useOnlineStatus();

  const allCountries = data?.data ?? [];
  const filteredCountries = useFilteredCountries(allCountries, searchQuery);

  const handleSelectCountry = (country: any) => {
    navigation.navigate("CountryDetails", { country });
  };

  if (isPending && !data) {
    return <LoadingIndicator />;
  }

  // Show error only if offline with no cached data
  if (error && !data) {
    return (
      <View style={styles.container}>
        <ErrorMessage
          message={
            !isOnline
              ? "No internet connection and no cached data available"
              : error instanceof Error
                ? error.message
                : "Failed to load countries"
          }
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠️ You're offline - showing cached data
          </Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Countries</Text>
      </View>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />
      {filteredCountries.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={(item, index) => item.countryId + "-" + index}
          renderItem={({ item }) => (
            <CountryCard country={item} onPress={handleSelectCountry} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => refetch()}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  offlineBanner: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fcd34d",
  },
  offlineText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#92400e",
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
