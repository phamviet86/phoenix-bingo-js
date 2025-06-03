import { createContext, useContext, useMemo } from "react";
import { useAppContext } from "../../provider";
import { setSelection } from "@/lib/util/convert-util";

const PageContext = createContext(null);

export function PageProvider({ children }) {
  const { optionData } = useAppContext();

  const courseStatus = setSelection(
    optionData,
    { value: "id", label: "option_label", color: "option_color" },
    { option_table: "courses", option_column: "course_status_id" }
  );

  const contextValue = useMemo(
    () => ({
      courseStatus,
    }),
    [courseStatus]
  );

  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
