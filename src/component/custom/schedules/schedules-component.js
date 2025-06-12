import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  FullCalendar,
} from "@/component/common";
import { fetchList, fetchPost, fetchGet } from "@/lib/util/fetch-util";
import { VIEWS_CONFIG } from "@/component/config/calendar-config";

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
      onDataRequest={(params) => fetchGet(`/api/schedules/${params?.id}`)}
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
      views={{
        dayGrid: {
          ...VIEWS_CONFIG.dayGrid,
        },
        dayGridWeek: {
          ...VIEWS_CONFIG.dayGridWeek,
        },
        dayGridMonth: {
          ...VIEWS_CONFIG.dayGridMonth,
        },
      }}
      onDataItem={{
        id: "id",
        title: "module_name",
        startDate: "schedule_date",
        startTime: "shift_start_time",
        endDate: "schedule_date",
        endTime: "shift_end_time",
        backgroundColor: "schedule_status_color",
      }}
    />
  );
}
