import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import { fetchList, fetchPost, fetchPut } from "@/lib/util/fetch-util";

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

export function RoomFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/rooms", values)}
      title="Tạo phòng học"
    />
  );
}

export function RoomFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPut(`/api/rooms/${id}`, values)}
      title="Sửa phòng học"
    />
  );
}
