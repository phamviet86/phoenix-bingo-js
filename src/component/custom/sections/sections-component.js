import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  Transfer,
  Modal,
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

export function SectionsTransfer({ classId, ...props }) {
  return (
    <Modal {...props} title="Điều chỉnh lộ trình" footer={false}>
      <Transfer
        onSourceRequest={() =>
          fetchList(`/api/classes/${classId}/unassigned-modules`, {})
        }
        onAddTarget={(keys) =>
          fetchPost(`/api/classes/${classId}/sections`, {
            moduleIds: keys,
          })
        }
        onTargetRequest={() =>
          fetchList(`/api/classes/${classId}/sections`, {})
        }
        onRemoveTarget={(keys) =>
          fetchDelete(`/api/classes/${classId}/sections`, {
            moduleIds: keys,
          })
        }
        onSourceItem={{
          key: "id",
          course: "course_name",
          module: "module_name",
        }}
        onTargetItem={{
          key: "module_id",
          course: "course_name",
          module: "module_name",
          disabled: ["section_status", [], ["Chưa có lịch"]],
        }}
        titles={["Học phần", "Đã gán"]}
        operations={["Thêm lộ trình", "Xóa lộ trình"]}
        listStyle={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
        }}
        render={(item) => `${item.course} - ${item.module}`}
      />
    </Modal>
  );
}

export function SectionsSummaryTable({ dateRange, ...props }) {
  const { startDate, endDate } = dateRange || {};

  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList(`/api/sections/${startDate}/${endDate}`, params, sort, filter)
      }
      params={{
        section_start_date_lt: endDate,
        or: {
          section_end_date_gte: startDate,
          section_end_date_null: true,
        },
      }}
    />
  );
}
