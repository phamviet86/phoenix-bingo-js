// path: @/component/custom/courses/courses-component.js

import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import { fetchList, fetchGet, fetchPost } from "@/lib/util/fetch-util";

export function CourseTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/courses", params, sort, filter)
      }
    />
  );
}

export function CourseForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/courses", values)}
    />
  );
}

export function CourseDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) => fetchGet(`/api/courses/${params?.id}`)}
    />
  );
}

export function CourseInfo(props) {
  return <DrawerInfo {...props} />;
}
