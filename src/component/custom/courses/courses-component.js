// path: @/component/custom/courses/courses-component.js

import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import { fetchList, fetchGet, fetchPost } from "@/lib/util/fetch-util";

export function CoursesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/courses", params, sort, filter)
      }
    />
  );
}

export function CoursesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/courses", values)}
    />
  );
}

export function CoursesDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) =>
        params?.id && fetchGet(`/api/courses/${params?.id}`)
      }
    />
  );
}

export function CoursesInfo(props) {
  return <DrawerInfo {...props} />;
}
