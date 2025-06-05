import { useState, useEffect } from "react";
import { Transfer, message, Spin } from "antd";
import { LoadingSpin } from "@/component/common";
import { convertTransferItems } from "@/lib/util/convert-util";

export function RemoteTransfer({
  onSourceRequest = undefined,
  onSourceParams = undefined,
  onSourceItem = undefined,
  onTargetRequest = undefined,
  onTargetParams = undefined,
  onTargetItem = undefined,
  onAddTarget = undefined,
  onRemoveTarget = undefined,
  listStyle = undefined,
  ...props
}) {
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // Handlers
  const handleSourceRequest = async (onSourceParams) => {
    if (!onSourceRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onSourceRequest(onSourceParams);
      if (onSourceItem) {
        return convertTransferItems(result.data || [], onSourceItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  };

  const handleTargetRequest = async (onTargetParams) => {
    if (!onTargetRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }
    try {
      const result = await onTargetRequest(onTargetParams);
      if (onTargetItem) {
        return convertTransferItems(result.data || [], onTargetItem);
      }
      return result.data || [];
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
      return [];
    }
  };

  // Reload data function
  const reloadData = async () => {
    setLoading(true);
    try {
      const [source, target] = await Promise.all([
        handleSourceRequest(onSourceParams),
        handleTargetRequest(onTargetParams),
      ]);

      // Merge source and target data to ensure all items are available
      const allItems = [...source, ...target];
      // Remove duplicates based on key
      const uniqueItems = allItems.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.key === item.key)
      );

      setDataSource(uniqueItems);
      setTargetKeys(target.map((item) => item.key));
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTarget = async (keys) => {
    if (!onAddTarget) {
      messageApi.error("Data add handler not provided");
      return;
    }
    try {
      const result = await onAddTarget(keys);
      if (result?.success) {
        messageApi.success("Thêm thành công");
        await reloadData();
      } else {
        messageApi.error(result?.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
    }
  };

  const handleRemoveTarget = async (keys) => {
    if (!onRemoveTarget) {
      messageApi.error("Data remove handler not provided");
      return;
    }
    try {
      const result = await onRemoveTarget(keys);
      if (result?.success) {
        messageApi.success("Xóa thành công");
        await reloadData();
      } else {
        messageApi.error(result?.message || "Đã xảy ra lỗi");
      }
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi");
    }
  };

  // Fetch data khi mount
  useEffect(() => {
    reloadData();
  }, []);

  // Khi chuyển record (sang phải/trái)
  const handleChange = async (nextTargetKeys, direction, moveKeys) => {
    if (direction === "right") {
      await handleAddTarget(moveKeys);
    } else {
      await handleRemoveTarget(moveKeys);
    }
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  if (loading) return <LoadingSpin />;

  return (
    <>
      {contextHolder}
      <Transfer
        {...props}
        dataSource={dataSource}
        titles={["Source", "Target"]}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        rowKey={(item) => item.key}
        render={(item) => item.title}
        listStyle={listStyle}
      />
    </>
  );
}
