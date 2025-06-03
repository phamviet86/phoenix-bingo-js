import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
} from "@/lib/util/fetch-util";

export function RoleTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/roles", params, sort, filter)
      }
    />
  );
}

export function RoleDesc(props) {
  return <ProDescriptions {...props} />;
}

export function RoleInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RoleFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/roles", values)}
      title="Tạo vai trò"
    />
  );
}

export function RoleFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataRequest={() => fetchGet(`/api/roles/${id}`)}
      onDataSubmit={(values) => fetchPut(`/api/roles/${id}`, values)}
      title="Sửa vai trò"
    />
  );
}
