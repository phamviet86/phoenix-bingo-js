// path: @/component/custom/rooms/rooms-schema.js

import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form";

export function RoomsColumns() {
  return [
    {
      title: "Phòng",
      dataIndex: "room_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "room_desc",
      valueType: "textarea",
      ellipsis: true,
      search: false,
    },
  ];
}

export function RoomsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="room_name"
        label="Tên phòng"
        placeholder="Nhập tên phòng"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="room_desc"
        label="Mô tả"
        placeholder="Nhập mô tả phòng"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
