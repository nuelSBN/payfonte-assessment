import NetInfo from "@react-native-community/netinfo";

export const isNetworkAvailable = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return !!(state.isConnected && state.isInternetReachable);
  } catch {
    return false;
  }
};

export const subscribeToNetworkChanges = (
  callback: (isOnline: boolean) => void,
) => {
  return NetInfo.addEventListener((state) => {
    const isOnline = !!(state.isConnected && state.isInternetReachable);
    callback(isOnline);
  });
};
