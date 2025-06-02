// path: @/component/hook/useTable.js

import { useRef } from "react";

export function useTable() {
  const tableRef = useRef();

  const reload = () => {
    if (tableRef.current) {
      tableRef.current.reload();
    }
  };

  return {
    tableRef,
    reload,
  };
}
