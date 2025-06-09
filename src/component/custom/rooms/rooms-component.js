// path: @/component/custom/rooms/rooms-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function RoomsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/rooms", params, sort, filter)
      }
    />
  );
}

export function RoomsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/rooms", values)}
    />
  );
}

export function RoomsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RoomsDesc(props) {
  return <ProDescriptions {...props} />;
}
