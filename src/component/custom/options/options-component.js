import { ProTable, DrawerInfo, DrawerForm } from "@/component/common";
import { fetchLIST, fetchPOST } from "@/lib/util/fetch-util";

export function OptionTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchLIST("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionInfo(props) {
  return <DrawerInfo {...props} />;
}

export function OptionForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPOST("/api/options", values)}
    />
  );
}
