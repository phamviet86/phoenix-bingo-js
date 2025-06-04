// path: @/component/custom/roles/roles-component.js

import {
  ProTable,
  DrawerForm,
  ProDescriptions,
  DrawerInfo,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

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

export function RoleForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/roles", values)}
    />
  );
}
