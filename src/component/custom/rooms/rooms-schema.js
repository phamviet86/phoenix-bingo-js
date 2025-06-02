import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form";

export function RoomsColumns() {
  return [
    {
      title: "Tên phòng",
      dataIndex: "room_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "room_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
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
