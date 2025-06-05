// path: @/components/common/pop-confirm.js

import { useCallback } from "react";
import { Popconfirm as AntPopconfirm, message } from "antd";

export function Popconfirm({
  onDataConfirm = undefined,
  onDataConfirmError = undefined,
  onDataConfirmSuccess = undefined,
  onDataCancel = undefined,
  onDataCancelError = undefined,
  onDataCancelSuccess = undefined,
  showConfirmMessage = false,
  showCancelMessage = false,
  ...props
}) {
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleConfirm = useCallback(async () => {
    if (!onDataConfirm) {
      messageApi.error("Data confirm handler not provided");
      return false;
    }

    try {
      const result = await onDataConfirm();
      if (showConfirmMessage && result?.message) {
        messageApi.success(result.message);
      }
      onDataConfirmSuccess?.(result);
      return result || true;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onDataConfirmError?.(error);
      return false;
    }
  }, [
    onDataConfirm,
    onDataConfirmSuccess,
    onDataConfirmError,
    showConfirmMessage,
    messageApi,
  ]);

  const handleCancel = useCallback(async () => {
    if (!onDataCancel) {
      messageApi.error("Data cancel handler not provided");
      return false;
    }

    try {
      const result = await onDataCancel();
      if (showCancelMessage && result?.message) {
        messageApi.warning(result.message);
      }
      onDataCancelSuccess?.(result);
      return result || false;
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      onDataCancelError?.(error);
      return false;
    }
  }, [
    onDataCancel,
    onDataCancelSuccess,
    onDataCancelError,
    showCancelMessage,
    messageApi,
  ]);

  // Render component
  return (
    <>
      {contextHolder}
      <AntPopconfirm
        {...props}
        onConfirm={onDataConfirm ? handleConfirm : undefined}
        onCancel={onDataCancel ? handleCancel : undefined}
      />
    </>
  );
}