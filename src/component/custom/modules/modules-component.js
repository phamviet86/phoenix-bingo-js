// path: @/component/custom/modules/modules-component.js

import {
  ProTable,
  DrawerForm,
  ProDescriptions,
  DrawerInfo,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function ModuleTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/modules", params, sort, filter)
      }
    />
  );
}

export function ModuleForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/modules", values)}
    />
  );
}

export function ModuleDesc(props) {
  return <ProDescriptions {...props} />;
}

export function ModuleInfo(props) {
  return <DrawerInfo {...props} />;
}
