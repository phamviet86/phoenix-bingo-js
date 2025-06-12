// path: @/component/custom/classes/classes-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost, fetchGet } from "@/lib/util/fetch-util";

export function ClassesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/classes", params, sort, filter)
      }
    />
  );
}

export function ClassesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/classes", values)}
    />
  );
}

export function ClassesInfo(props) {
  return <DrawerInfo {...props} />;
}

export function ClassesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) =>
        params?.id && fetchGet(`/api/classes/${params?.id}`)
      }
    />
  );
}
