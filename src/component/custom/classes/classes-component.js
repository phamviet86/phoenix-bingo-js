// path: @/component/custom/classes/classes-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost, fetchGet } from "@/lib/util/fetch-util";

export function ClassTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/classes", params, sort, filter)
      }
    />
  );
}

export function ClassForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/classes", values)}
    />
  );
}

export function ClassInfo(props) {
  return <DrawerInfo {...props} />;
}

export function ClassDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) => fetchGet(`/api/classes/${params?.id}`)}
    />
  );
}
