// path: @/component/custom/modules/modules-component.js

import {
  ProTable,
  DrawerForm,
  ProDescriptions,
  DrawerInfo,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function ModulesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/modules", params, sort, filter)
      }
    />
  );
}

export function ModulesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/modules", values)}
    />
  );
}

export function ModulesDesc(props) {
  return <ProDescriptions {...props} />;
}

export function ModulesInfo(props) {
  return <DrawerInfo {...props} />;
}
