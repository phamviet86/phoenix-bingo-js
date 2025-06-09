// path: @/component/custom/lessons/lessons-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function LessonsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/lessons", params, sort, filter)
      }
    />
  );
}

export function LessonsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/lessons", values)}
    />
  );
}

export function LessonsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function LessonsDesc(props) {
  return <ProDescriptions {...props} />;
}
