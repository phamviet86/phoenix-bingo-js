// path: @/src/component/custom/users/users-component.js

import { Image, Avatar } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  Button,
  Popconfirm,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchGet,
  fetchPut,
} from "@/lib/util/fetch-util";

export function UsersTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/users", params, sort, filter)
      }
    />
  );
}

export function UsersForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/users", values)}
    />
  );
}

export function UsersInfo(props) {
  return <DrawerInfo {...props} />;
}

export function UsersDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) =>
        params?.id && fetchGet(`/api/users/${params?.id}`)
      }
    />
  );
}

export function UsersPicture({ userAvatar, ...props }) {
  if (userAvatar)
    return (
      <Image
        {...props}
        alt="Hình ảnh người dùng"
        src={userAvatar}
        style={{
          objectFit: "contain", // cover
          width: "auto",
          maxWidth: "100%",
          maxHeight: 240,
        }}
        preview={{
          mask: false,
          closable: true,
          title: "Hình ảnh người dùng",
          footer: null,
        }}
      />
    );

  return <Avatar icon={<UserOutlined />} size={240} shape="square" />;
}

export function UsersResetPassword({ userId, ...props }) {
  return (
    <Popconfirm
      onPopConfirm={() => fetchPut(`/api/users/${userId}/reset-password`)}
      showConfirmMessage={true}
      icon={<LockOutlined />}
      title="Xác nhận đặt lại mật khẩu"
      description="Bạn có chắc chắn muốn tiếp tục?"
      okText="Đặt lại"
      okType="primary"
      cancelText="Hủy"
    >
      <Button
        {...props}
        label="Đặt lại mật khẩu"
        icon={<LockOutlined />}
        color="primary"
        variant="link"
      />
    </Popconfirm>
  );
}
