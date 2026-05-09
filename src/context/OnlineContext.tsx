import React, { createContext, useContext } from "react";

interface OnlineContextType {
  isOnline: boolean;
}

const OnlineContext = createContext<OnlineContextType | undefined>(undefined);

export const OnlineProvider: React.FC<{
  children: React.ReactNode;
  isOnline: boolean;
}> = ({ children, isOnline }) => (
  <OnlineContext.Provider value={{ isOnline }}>
    {children}
  </OnlineContext.Provider>
);

export const useOnlineStatus = (): boolean => {
  const context = useContext(OnlineContext);
  if (!context) {
    throw new Error("useOnlineStatus must be used within OnlineProvider");
  }
  return context.isOnline;
};
