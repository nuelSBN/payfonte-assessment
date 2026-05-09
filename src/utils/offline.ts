import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

const QUERY_CACHE_KEY = "rq-cache";

export const asyncStoragePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    try {
      await AsyncStorage.setItem(QUERY_CACHE_KEY, JSON.stringify(client));
    } catch (error) {
      console.warn("Failed to persist query client:", error);
    }
  },

  restoreClient: async () => {
    try {
      const cached = await AsyncStorage.getItem(QUERY_CACHE_KEY);
      return cached ? JSON.parse(cached) : undefined;
    } catch (error) {
      console.warn("Failed to restore query client:", error);
      return undefined;
    }
  },

  removeClient: async () => {
    try {
      await AsyncStorage.removeItem(QUERY_CACHE_KEY);
    } catch (error) {
      console.warn("Failed to remove query client:", error);
    }
  },
};

export const clearOfflineCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(QUERY_CACHE_KEY);
  } catch (error) {
    console.warn("Failed to clear offline cache:", error);
  }
};
