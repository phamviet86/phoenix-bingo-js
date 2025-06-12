// path: @/component/hook/useForm.js

import { useRef, useState } from "react";

export function useForm() {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [params, setParams] = useState({});
  const [title, setTitle] = useState("");

  const open = () => {
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setRecord({});
    setParams({});
    setTitle("");
  };

  const reset = () => {
    if (formRef.current) {
      formRef.current.resetFields();
    }
  };

  return {
    formRef,
    reset,
    visible,
    setVisible,
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
