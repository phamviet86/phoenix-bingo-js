// path: @/component/hook/useInfo.js

import { useRef, useState } from "react";

export function useInfo() {
  const infoRef = useRef();
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const [params, setParams] = useState({});
  const [title, setTitle] = useState("");

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setDataSource({});
    setParams({});
    setTitle("");
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
    dataSource,
    setDataSource,
    params,
    setParams,
    title,
    setTitle,
    open,
    close,
  };
}
