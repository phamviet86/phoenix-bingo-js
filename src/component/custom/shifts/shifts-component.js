// path: @/component/custom/shifts/shifts-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function ShiftsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/shifts", params, sort, filter)
      }
    />
  );
}

export function ShiftsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/shifts", values)}
    />
  );
}

export function ShiftsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function ShiftsDesc(props) {
  return <ProDescriptions {...props} />;
}
