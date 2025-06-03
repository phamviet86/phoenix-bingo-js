import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
} from "@/lib/util/fetch-util";

export function ShiftTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/shifts", params, sort, filter)
      }
    />
  );
}

export function ShiftDesc(props) {
  return <ProDescriptions {...props} />;
}

export function ShiftInfo(props) {
  return <DrawerInfo {...props} />;
}

export function ShiftFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/shifts", values)}
      title="Tạo giờ học"
    />
  );
}

export function ShiftFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataRequest={() => fetchGet(`/api/shifts/${id}`)}
      onDataSubmit={(values) => fetchPut(`/api/shifts/${id}`, values)}
      title="Sửa giờ học"
    />
  );
}
