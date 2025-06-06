import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function SectionsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/sections", params, sort, filter)
      }
    />
  );
}

export function SectionsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/sections", values)}
    />
  );
}

export function SectionsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function SectionsDesc(props) {
  return <ProDescriptions {...props} />;
}
