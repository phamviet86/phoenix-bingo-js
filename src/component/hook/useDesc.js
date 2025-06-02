// path: @/component/hook/useDesc.js

import { useRef, useState } from "react";

export function useDesc() {
  const descRef = useRef();
  const [record, setRecord] = useState({});

  const reload = () => {
    if (descRef.current) {
      descRef.current.reload();
    }
  };

  return {
    descRef,
    reload,
    record,
    setRecord,
  };
}
