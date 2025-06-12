import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { setSelection } from "@/lib/util/convert-util";
import { useFetch } from "@/component/hook";

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

  // Fetch shifts data from the API
  const { useFetchList } = useFetch();
  const { data: shiftData = [] } = useFetchList("/api/shifts");
  const shiftSelection = setSelection(shiftData, {
    value: "id",
    label: "shift_name",
  });

  // Fetch rooms data from the API
  const { data: roomData = [] } = useFetchList("/api/rooms");
  const roomSelection = setSelection(roomData, {
    value: "id",
    label: "room_name",
  });

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      scheduleStatus,
      shiftSelection,
      roomSelection,
    }),
    [scheduleStatus, shiftSelection, roomSelection]
  );

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
