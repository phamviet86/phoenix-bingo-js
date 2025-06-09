// path: @/ src/component/custom/user-roles/user-roles-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  Transfer,
} from "@/component/common";
import { fetchList, fetchPost, fetchDelete } from "@/lib/util/fetch-util";

export function UserRolesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/user-roles", params, sort, filter)
      }
    />
  );
}

export function UserRolesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/user-roles", values)}
    />
  );
}

export function UserRolesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function UserRolesDesc(props) {
  return <ProDescriptions {...props} />;
}

export function UserRoleTransfer({ userId, ...props }) {
  return (
    <Transfer
      {...props}
      onSourceRequest={() =>
        fetchList(`/api/users/${userId}/unassigned-roles`, {})
      }
      onAddTarget={(keys) =>
        fetchPost(`/api/users/${userId}/user-roles`, { roleIds: keys })
      }
      onTargetRequest={() => fetchList(`/api/users/${userId}/user-roles`, {})}
      onRemoveTarget={(keys) =>
        fetchDelete(`/api/users/${userId}/user-roles`, { roleIds: keys })
      }
      onSourceItem={{ key: "id", title: "role_name" }}
      onTargetItem={{ key: "role_id", title: "role_name" }}
      titles={["Vai trò", "Đã gán"]}
      operations={["Thêm quyền", "Xóa quyền"]}
      listStyle={{
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
    />
  );
}
