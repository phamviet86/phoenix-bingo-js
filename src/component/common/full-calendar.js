// path: @/components/common/full-calendar.js

import { useEffect, useCallback } from "react";
import { message } from "antd";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CALENDAR_CONFIG } from "@/component/config/calendar-config";

export function FullCalendar({
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  plugins = [],
  height = "auto",
  calendarHook = {},
  ...props
}) {
  const { calendarRef, setStartDate, setEndDate, startDate, endDate } =
    calendarHook;
  const [messageApi, contextHolder] = message.useMessage();
  const allPlugins = [dayGridPlugin, ...plugins];

  // Handlers
  const handleDataRequest = useCallback(async () => {
    if (!onDataRequest) {
      messageApi.error("Data request handler not provided");
      return false;
    }

    try {
      const result = await onDataRequest(startDate, endDate);
      onDataRequestSuccess?.(result);
      return result;
    } catch (error) {
      messageApi.error(error?.message || "Đã xảy ra lỗi");
      onDataRequestError?.(error);
      return false;
    }
  }, [
    startDate,
    endDate,
    onDataRequest,
    onDataRequestSuccess,
    onDataRequestError,
    messageApi,
  ]);

  const handleDatesSet = useCallback(
    (dateInfo) => {
      if (setStartDate && setEndDate) {
        setStartDate(dateInfo.startStr);
        setEndDate(dateInfo.endStr);
      }
    },
    [setStartDate, setEndDate]
  );

  // Handle data request on component mount and when dates change
  useEffect(() => {
    if (onDataRequest && startDate && endDate) {
      handleDataRequest();
    }
  }, [handleDataRequest, onDataRequest, startDate, endDate]);

  return (
    <>
      {contextHolder}
      <Calendar
        {...props}
        {...CALENDAR_CONFIG}
        ref={calendarRef}
        plugins={allPlugins}
        height={height}
        datesSet={handleDatesSet}
      />
    </>
  );
}
