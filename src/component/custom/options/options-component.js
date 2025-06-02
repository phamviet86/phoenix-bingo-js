import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchPut,
} from "@/lib/util/fetch-util";

export function OptionTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionDesc(props) {
  return <ProDescriptions {...props} />;
}

export function OptionInfo(props) {
  return <DrawerInfo {...props} />;
}

export function OptionFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
      title="Tạo tùy chọn"
    />
  );
}

export function OptionFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPut(`/api/options/${id}`, values)}
      title="Sửa tùy chọn"
    />
  );
}
