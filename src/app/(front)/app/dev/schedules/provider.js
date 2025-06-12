import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { setSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  const { optionData } = useAppContext(); // sử dụng lại dữ liệu có trong cache

  // Create a selection for schedule status using the option data
  const scheduleStatus = setSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "schedules", option_column: "schedule_status_id" }
  );

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      scheduleStatus,
    }),
    [scheduleStatus]
  );

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
