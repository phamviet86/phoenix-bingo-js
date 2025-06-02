// path: @/component/common/pro-table.js

import { useCallback } from "react";
import { message } from "antd";
import { ProTable as AntProTable } from "@ant-design/pro-components";
import { TABLE_CONFIG } from "@/component/config/table-config";

export function ProTable({
  columns = [],
  leftColumns = [],
  rightColumns = [],
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  onRowsSelect = undefined,
  onRowsSelectError = undefined,
  onRowClick = undefined,
  onRowClickError = undefined,
  showSearch = true,
  showOptions = false,
  showPagination = true,
  selectType = "checkbox",
  tableHook = {},
  ...props
}) {
  const { tableRef } = tableHook;
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleDataRequest = useCallback(
    async (requestParams, sortConfig, filterConfig) => {
      if (!onDataRequest) {
        messageApi.error("Data request handler not provided");
        return false;
      }

      try {
        const result = await onDataRequest(
          requestParams,
          sortConfig,
          filterConfig
        );
        onDataRequestSuccess?.(result);
        return result;
      } catch (error) {
        const errorMessage = error?.message || "Đã xảy ra lỗi";
        messageApi.error(errorMessage);
        onDataRequestError?.(error);
        return false;
      }
    },
    [onDataRequest, onDataRequestSuccess, onDataRequestError, messageApi]
  );

  const handleRowsSelect = useCallback(
    (_, selectedRowsData) => {
      if (!onRowsSelect) return true;

      try {
        onRowsSelect(selectedRowsData);
        return true;
      } catch (error) {
        const errorMessage = error?.message || "Đã xảy ra lỗi";
        messageApi.error(errorMessage);
        onRowsSelectError?.(error);
        return false;
      }
    },
    [onRowsSelect, onRowsSelectError, messageApi]
  );

  const handleRowClick = useCallback(
    (rowRecord) => {
      if (!onRowClick) return true;

      try {
        onRowClick(rowRecord);
        return true;
      } catch (error) {
        const errorMessage = error?.message || "Đã xảy ra lỗi";
        messageApi.error(errorMessage);
        onRowClickError?.(error);
        return false;
      }
    },
    [onRowClick, onRowClickError, messageApi]
  );

  // Render component
  return (
    <>
      {contextHolder}
      <AntProTable
        {...props}
        actionRef={tableRef}
        columns={[...leftColumns, ...columns, ...rightColumns]}
        request={onDataRequest ? handleDataRequest : undefined}
        rowSelection={
          onRowsSelect
            ? { type: selectType, onChange: handleRowsSelect }
            : undefined
        }
        onRow={
          onRowClick
            ? (record) => ({ onClick: () => handleRowClick(record) })
            : undefined
        }
        search={showSearch ? TABLE_CONFIG.search : false}
        pagination={showPagination ? TABLE_CONFIG.pagination : false}
        options={showOptions ? TABLE_CONFIG.options : false}
        tableAlertRender={false}
        rowKey="id"
        bordered
        ghost
      />
    </>
  );
}
