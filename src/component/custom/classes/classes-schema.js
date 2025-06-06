// path: @/component/custom/classes/classes-schema.js

import { ProForm, ProFormText } from "@ant-design/pro-form";

export function ClassesColumns() {
  return [
    {
      title: "Tên lớp",
      dataIndex: "class_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mã lớp",
      dataIndex: "class_code",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function ClassesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="class_name"
        label="Tên lớp"
        placeholder="Nhập tên lớp học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="class_code"
        label="Mã lớp"
        placeholder="Nhập mã lớp học"
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
}
