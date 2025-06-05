import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

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
