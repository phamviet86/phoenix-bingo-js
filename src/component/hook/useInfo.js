// path: @/component/hook/useInfo.js

import { useRef, useState } from "react";

export function useInfo() {
  const infoRef = useRef();
  const [record, setRecord] = useState({});
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [params, setParams] = useState({});

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setRecord({});
  };

  const reload = () => {
    if (infoRef.current) {
      infoRef.current.reload();
    }
  };

  return {
    infoRef,
    reload,
    visible,
    record,
    setRecord,
    params,
    setParams,
    title,
    setTitle,
    open,
    close,
  };
}
