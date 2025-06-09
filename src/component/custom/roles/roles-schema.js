// path: @/component/custom/roles/roles-schema.js

import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { COLOR_ENUM } from "@/component/config";

export function RolesColumns() {
  return [
    {
      title: "Vai trò",
      dataIndex: "role_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Đường dẫn",
      dataIndex: "role_path",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Màu sắc",
      dataIndex: "role_color",
      valueType: "select",
      valueEnum: COLOR_ENUM,
      sorter: { multiple: 1 },
      responsive: ["md"],
    },
  ];
}

export function RolesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="role_name"
        label="Tên vai trò"
        placeholder="Nhập tên vai trò"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="role_path"
        label="Đường dẫn"
        placeholder="Nhập đường dẫn"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="role_color"
        label="Màu sắc"
        placeholder="Chọn màu sắc"
        rules={[{ required: true }]}
        valueEnum={COLOR_ENUM}
      />
    </ProForm.Group>
  );
}
