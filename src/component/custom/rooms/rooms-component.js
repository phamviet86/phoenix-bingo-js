// path: @/component/custom/rooms/rooms-component.js

import {
  ProTable,
  DrawerForm,
  ProDescriptions,
  DrawerInfo,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function RoomTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/rooms", params, sort, filter)
      }
    />
  );
}

export function RoomDesc(props) {
  return <ProDescriptions {...props} />;
}

export function RoomInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RoomForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/rooms", values)}
    />
  );
}
