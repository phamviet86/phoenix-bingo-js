import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";
import {
  renderUser,
  renderUserContact,
  renderUserAvatar,
} from "@/lib/util/render-util";

export function UsersColumns(params) {
  const { userStatus } = params;

  return [
    {
      title: "Ảnh",
      width: 80,
      render: (_, record) => renderUserAvatar(record),
      hideInDescriptions: true,
      search: false,
    },
    {
      title: "Người dùng",
      render: (_, record) => renderUser(record, userStatus?.enums),
      hideInDescriptions: true,
      search: false,
    },
    {
      title: "Liên hệ",
      render: (_, record) => renderUserContact(record),
      hideInDescriptions: true,
      search: false,
      responsive: ["md"],
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      valueType: "text",
      hidden: true,
    },
    {
      title: "Mô tả",
      dataIndex: "user_desc",
      valueType: "text",
      hidden: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "user_status_id",
      valueType: "select",
      valueEnum: userStatus?.enums,
      hidden: true,
    },
    {
      title: "Email",
      dataIndex: "user_email",
      valueType: "text",
      hidden: true,
    },
    {
      title: "SĐT",
      dataIndex: "user_phone",
      valueType: "text",
      hidden: true,
    },
    {
      title: "SĐT phụ huynh",
      dataIndex: "user_parent_phone",
      valueType: "text",
      hidden: true,
    },
    {
      title: "Ghi chú",
      dataIndex: "user_notes",
      valueType: "textarea",
      ellipsis: true,
      search: false,
      hidden: true,
    },
  ];
}

export function UsersFields(params) {
  const { userStatus } = params;

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="user_name"
        label="Tên người dùng"
        placeholder="Nhập tên người dùng"
        rules={[{ required: true }]}
      />
      <ProFormText name="user_desc" label="Mô tả" placeholder="Nhập mô tả" />
      <ProFormText
        name="user_email"
        label="Email"
        placeholder="Nhập địa chỉ email"
        rules={[
          { required: true },
          { type: "email", message: "Email không hợp lệ!" },
        ]}
      />
      <ProFormSelect
        name="user_status_id"
        label="Trạng thái"
        placeholder="Nhập ID trạng thái"
        rules={[{ required: true }]}
        options={userStatus?.options}
      />
      <ProFormText
        name="user_phone"
        label="SĐT"
        placeholder="Nhập SĐT"
        colProps={{ xs: 12 }}
      />
      <ProFormText
        name="user_parent_phone"
        label="SĐT phụ huynh"
        placeholder="Nhập SĐT"
        colProps={{ xs: 12 }}
      />
      <ProFormTextArea
        name="user_avatar"
        label="Ảnh đại diện"
        placeholder="Nhập đường dẫn ảnh đại diện"
        fieldProps={{ autoSize: { minRows: 1, maxRows: 3 } }}
      />
      <ProFormTextArea
        name="user_notes"
        label="Ghi chú"
        placeholder="Nhập ghi chú"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
