// path: @/component/custom/roles/roles-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function RolesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/roles", params, sort, filter)
      }
    />
  );
}

export function RolesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/roles", values)}
    />
  );
}

export function RolesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RolesDesc(props) {
  return <ProDescriptions {...props} />;
}
