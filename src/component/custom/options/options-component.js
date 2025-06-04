import {
  ProTable,
  DrawerForm,
  ProDescriptions,
  DrawerInfo,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

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

export function OptionForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionDesc(props) {
  return <ProDescriptions {...props} />;
}

export function OptionInfo(props) {
  return <DrawerInfo {...props} />;
}
