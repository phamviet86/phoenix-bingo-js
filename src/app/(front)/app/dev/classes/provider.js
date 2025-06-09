import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { setSelection } from "@/lib/util/convert-util";
import { useFetch } from "@/component/hook";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  // Access the option data from the AppContext
  const { optionData } = useAppContext(); // sử dụng lại dữ liệu có trong cache

  // Create a selection for user status using the option data
  const userStatus = setSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "users", option_column: "user_status_id" }
  );

  // Fetch roles data from the API
  const { useFetchList } = useFetch();
  const { data: roleData = [] } = useFetchList("/api/roles");
  const roleSelection = setSelection(roleData, {
    value: "role_name",
    label: "role_name",
    color: "role_color",
  });

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userStatus,
      roleSelection,
    }),
    [userStatus, roleSelection]
  );

  // Provide the context to children components
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
