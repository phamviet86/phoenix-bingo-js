// path: @/ src/component/custom/user-roles/user-roles-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  RemoteTransfer,
} from "@/component/common";
import { fetchList, fetchPost, fetchDelete } from "@/lib/util/fetch-util";

export function UserRoleTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/user-roles", params, sort, filter)
      }
    />
  );
}

export function UserRoleForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/user-roles", values)}
    />
  );
}

export function UserRoleInfo(props) {
  return <DrawerInfo {...props} />;
}

export function UserRoleDesc(props) {
  return <ProDescriptions {...props} />;
}

export function UserRoleTransfer({ userId, ...props }) {
  return (
    <RemoteTransfer
      {...props}
      onSourceRequest={() =>
        fetchList(`/api/users/${userId}/unassigned-roles`, {})
      }
      onAddTarget={(keys) =>
        fetchPost(`/api/users/${userId}/user-roles`, { roleIds: keys })
      }
      onTargetRequest={() => fetchList(`/api/user-roles`, { user_id: userId })}
      onRemoveTarget={(keys) => fetchDelete(`/api/user-roles`, { ids: keys })}
      onSourceItem={{ key: "id", title: "role_name" }}
      onTargetItem={{ key: "id", title: "role_name" }}
      titles={["Vai trò", "Đã gán"]}
      operations={["Thêm", "Xóa"]}
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
    />
  );
}
