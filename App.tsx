import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { OnlineProvider } from "./src/context/OnlineContext";
import { asyncStoragePersister } from "./src/utils/offline";
import { subscribeToNetworkChanges } from "./src/utils/network";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Persist the query client to AsyncStorage
persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
});

export default function App() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = subscribeToNetworkChanges((isOnline) => {
      setIsOnline(isOnline);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <OnlineProvider isOnline={isOnline}>
          <RootNavigator />
          <StatusBar style="auto" />
        </OnlineProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
