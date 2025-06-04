// path: @/component/custom/rooms/rooms-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
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

export function RoomForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/rooms", values)}
    />
  );
}

export function RoomInfo(props) {
  return <DrawerInfo {...props} />;
}

export function RoomDesc(props) {
  return <ProDescriptions {...props} />;
}
