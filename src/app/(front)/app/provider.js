import { createContext, useContext, useMemo } from "react";
import { useFetch } from "@/component/hook";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { useFetchList } = useFetch();
  const optionList = useFetchList("/api/options");
  const optionData = optionList.data || [];

  const contextValue = useMemo(
    () => ({
      optionData,
    }),
    [optionData]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
