import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  RemoteTransfer,
} from "@/component/common";
import { fetchList, fetchPost, fetchDelete } from "@/lib/util/fetch-util";

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

export function SectionTransfer({ classId, ...props }) {
  return (
    <RemoteTransfer
      {...props}
      onSourceRequest={() =>
        fetchList(`/api/classes/${classId}/unassigned-modules`, {})
      }
      onAddTarget={(keys) =>
        fetchPost(`/api/classes/${classId}/assigned-modules`, {
          moduleIds: keys,
        })
      }
      onTargetRequest={() =>
        fetchList(`/api/classes/${classId}/assigned-modules`, {})
      }
      onRemoveTarget={(keys) =>
        fetchDelete(`/api/classes/${classId}/assigned-modules`, {
          moduleIds: keys,
        })
      }
      onSourceItem={{ key: "id", course: "course_name", module: "module_name" }}
      onTargetItem={{
        key: "module_id",
        course: "course_name",
        module: "module_name",
      }}
      titles={["Học phần", "Đã gán"]}
      operations={["Thêm lộ trình", "Xóa lộ trình"]}
    />
  );
}
