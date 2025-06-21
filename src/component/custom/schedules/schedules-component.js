import { Modal } from "antd";
import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  FullCalendar,
  Transfer,
} from "@/component/common";
import {
  fetchList,
  fetchPost,
  fetchGet,
  fetchDelete,
} from "@/lib/util/fetch-util";
import { VIEWS_CONFIG } from "@/component/config/calendar-config";
import { renderScheduleShort } from "@/lib/util/render-util";

export function SchedulesTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/schedules", params, sort, filter)
      }
    />
  );
}

export function SchedulesForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/schedules", values)}
    />
  );
}

export function SchedulesInfo(props) {
  return (
    <DrawerInfo
      {...props}
      onDataRequest={(params) =>
        params?.id && fetchGet(`/api/schedules/${params?.id}`)
      }
    />
  );
}

export function SchedulesDesc(props) {
  return <ProDescriptions {...props} />;
}

export function SchedulesCalendar(props) {
  return (
    <FullCalendar
      {...props}
      onDataRequest={(params) => fetchList("/api/schedules", params)}
      onDataItem={{
        id: "id",
        title: "module_name",
        startDate: "schedule_date",
        startTime: "shift_start_time",
        endDate: "schedule_date",
        endTime: "shift_end_time",
        extendedProps: {
          id: "id",
          shift_start_time: "shift_start_time",
          class_name: "class_name",
          class_code: "class_code",
          module_name: "module_name",
          schedule_status_color: "schedule_status_color",
        },
      }}
      views={{
        dayGrid: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGrid,
        },
        dayGridWeek: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGridWeek,
        },
        dayGridMonth: {
          eventContent: renderScheduleShort,
          ...VIEWS_CONFIG.dayGridMonth,
        },
      }}
    />
  );
}

export function SchedulesTransfer({ dateRange = undefined, ...props }) {
  if (!dateRange) {
    return null;
  }

  const { date1, date2, date3 } = dateRange;
  return (
    <Modal {...props} title="Sao chép lịch học" footer={false} width={800}>
      <Transfer
        onSourceRequest={() =>
          fetchList("/api/schedules", {
            schedule_date_gte: date1,
            schedule_date_lt: date2,
          })
        }
        onTargetRequest={() =>
          fetchList("/api/schedules", {
            source_id_nnull: true,
            schedule_date_gte: date2,
            schedule_date_lt: date3,
          })
        }
        onAddTarget={(keys) =>
          fetchPost(`/api/schedules/transfer`, {
            ids: keys,
          })
        }
        onRemoveTarget={(keys) =>
          fetchDelete(`/api/schedules/transfer`, {
            ids: keys,
          })
        }
        onSourceItem={{
          key: "id",
          date: "schedule_date",
          time: "shift_start_time",
          class: "class_code",
          module: "module_name",
        }}
        onTargetItem={{
          key: "source_id",
          date: "schedule_date",
          time: "shift_start_time",
          class: "class_code",
          module: "module_name",
        }}
        titles={["Học phần", "Đã gán"]}
        operations={["Thêm lịch", "Xóa lịch"]}
        listStyle={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
        }}
        render={(item) => `${item.class} - ${item.module}`}
      />
    </Modal>
  );
}
