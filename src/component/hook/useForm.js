// path: @/component/hook/useForm.js

import { useRef, useState } from "react";

export function useForm() {
  const formRef = useRef();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [title, setTitle] = useState("");

  const open = (record) => {
    setRecord(record);
    setVisible(true);
  };

  const close = () => {
    setVisible(false);
    setRecord({});
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
    title,
    setTitle,
    open,
    close,
  };
}
