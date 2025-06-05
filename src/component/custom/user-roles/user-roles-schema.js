import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";

export function UserRolesColumns() {
  return [
    {
      title: "Tên vai trò",
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
    },
  ];
}

export function UserRolesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="user_id"
        label="User ID"
        placeholder="Nhập User ID"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="role_id"
        label="Role ID"
        placeholder="Nhập Role ID"
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
}
