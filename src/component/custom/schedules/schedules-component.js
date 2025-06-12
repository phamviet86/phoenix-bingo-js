import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  FullCalendar,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

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
  return <DrawerInfo {...props} />;
}

export function SchedulesDesc(props) {
  return <ProDescriptions {...props} />;
}

export function SchedulesCalendar({ params = {}, ...props }) {
  return (
    <FullCalendar
      {...props}
      onDataRequest={(start, end) =>
        fetchList("/api/schedules", {
          schedule_date: [start, end],
          ...params,
        })
      }
    />
  );
}
