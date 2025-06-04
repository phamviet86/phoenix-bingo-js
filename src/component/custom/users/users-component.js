import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function UserTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/users", params, sort, filter)
      }
    />
  );
}

export function UserForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/users", values)}
    />
  );
}

export function UserInfo(props) {
  return <DrawerInfo {...props} />;
}

export function UserDesc(props) {
  return (
    <ProDescriptions
      {...props}
      onDataRequest={(params) => fetchGet(`/api/users/${params?.id}`)}
    />
  );
}
