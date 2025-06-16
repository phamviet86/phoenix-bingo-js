import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  FullCalendar,
} from "@/component/common";
import { fetchList, fetchPost, fetchGet } from "@/lib/util/fetch-util";
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
