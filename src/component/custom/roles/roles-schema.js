import { ProForm, ProFormText } from "@ant-design/pro-form";

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
      valueType: "text",
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
        label="Vai trò"
        placeholder="Nhập vai trò"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="role_path"
        label="Đường dẫn"
        placeholder="Nhập đường dẫn"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="role_color"
        label="Màu sắc"
        placeholder="Nhập mã màu"
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
}
