// path: @/components/common/full-calendar.js

import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CALENDAR_CONFIG } from "@/component/config/calendar-config";

export function FullCalendar({
  plugins = [],
  height = "auto",
  dayMaxEvents = undefined,
  calendarHook = {},
  ...props
}) {
  const { calendarRef, setStartDate, setEndDate } = calendarHook;
  const allPlugins = [dayGridPlugin, ...plugins];

  const internalDatesSet = (dateInfo) => {
    if (setStartDate && setEndDate) {
      setStartDate(dateInfo.startStr);
      setEndDate(dateInfo.endStr);
    }
  };

  return (
    <Calendar
      {...props}
      {...CALENDAR_CONFIG}
      ref={calendarRef}
      plugins={allPlugins}
      height={height}
      dayMaxEvents={dayMaxEvents}
      datesSet={internalDatesSet}
    />
  );
}
