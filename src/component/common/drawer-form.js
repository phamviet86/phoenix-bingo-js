// path: @/component/common/drawer-form.js

import { useCallback } from "react";
import { message } from "antd";
import { DrawerForm as AntDrawerForm } from "@ant-design/pro-components";
import { DRAWER_CONFIG } from "@/component/config/drawer-config";

export function DrawerForm({
  fields = null,
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  onDataSubmit = undefined,
  onDataSubmitError = undefined,
  onDataSubmitSuccess = undefined,
  width = 520,
  formHook = {},
  ...props
}) {
  const { formRef, visible, setVisible } = formHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (params) => {
      if (!onDataRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onDataRequest(params);
        onDataRequestSuccess?.(result);
        return result.data[0] || {};
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onDataRequestError?.(error);
        return false;
      }
    },
    [onDataRequest, onDataRequestSuccess, onDataRequestError, messageApi]
  );

  const handleDataSubmit = useCallback(
    async (values) => {
      if (!onDataSubmit) {
        messageApi.error("Data submit handler not provided");
        return false;
      }
      if (!values) return false;

      try {
        const result = await onDataSubmit(values);
        messageApi.success(result.message);
        onDataSubmitSuccess?.(result);
        return true;
      } catch (error) {
        messageApi.error(error.message || "Đã xảy ra lỗi");
        onDataSubmitError?.(error);
        return false;
      }
    },
    [onDataSubmit, onDataSubmitSuccess, onDataSubmitError, messageApi]
  );

  // Render component
  return (
    <>
      {contextHolder}
      <AntDrawerForm
        {...props}
        formRef={formRef}
        open={visible}
        onOpenChange={setVisible}
        request={onDataRequest ? handleDataRequest : undefined}
        onFinish={onDataSubmit ? handleDataSubmit : undefined}
        drawerProps={DRAWER_CONFIG}
        width={width}
        autoFocusFirstInput={false}
        omitNil={false}
        grid={true}
      >
        {fields}
      </AntDrawerForm>
    </>
  );
}
