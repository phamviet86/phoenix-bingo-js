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

export function ModuleTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/modules", params, sort, filter)
      }
    />
  );
}

export function ModuleDesc(props) {
  return <ProDescriptions {...props} />;
}

export function ModuleInfo(props) {
  return <DrawerInfo {...props} />;
}

export function ModuleFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/modules", values)}
      title="Tạo học phần"
    />
  );
}

export function ModuleFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataRequest={() => fetchGet(`/api/modules/${id}`)}
      onDataSubmit={(values) => fetchPut(`/api/modules/${id}`, values)}
      title="Sửa học phần"
    />
  );
}
