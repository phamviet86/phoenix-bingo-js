// path: @/components/common/full-calendar.js

import { useEffect, useCallback } from "react";
import { message } from "antd";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CALENDAR_CONFIG } from "@/component/config/calendar-config";
import { convertEventItems } from "@/lib/util/convert-util";

export function FullCalendar({
  onDataRequest = undefined,
  onDataRequestError = undefined,
  onDataRequestSuccess = undefined,
  onDataItem = undefined,

  plugins = [],
  height = "auto",
  calendarHook = {},
  ...props
}) {
  const {
    calendarRef,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
    loading,
    setLoading,
    calendarEvents,
    setCalendarEvents,
  } = calendarHook;
  const [messageApi, contextHolder] = message.useMessage();
  const allPlugins = [dayGridPlugin, ...plugins];

  // Handlers
  const handleDataRequest = useCallback(async () => {
    if (!onDataRequest) {
      messageApi.error("Data request handler not provided");
      return [];
    }

    if (!startDate || !endDate) {
      messageApi.error("Start date and end date must be set");
      return [];
    }

    try {
      const result = await onDataRequest(startDate, endDate);
      let finalEvents = [];

      if (onDataItem) {
        const convertedItems = convertEventItems(result.data || [], onDataItem);
        console.log("Data request successful:", convertedItems);
        finalEvents = convertedItems;
      } else {
        finalEvents = result.data || result || [];
      }

      setCalendarEvents(finalEvents);
      onDataRequestSuccess?.(result);
      return finalEvents;
    } catch (error) {
      messageApi.error(error?.message || "Đã xảy ra lỗi");
      onDataRequestError?.(error);
      setCalendarEvents([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [
    onDataRequest,
    onDataRequestSuccess,
    onDataRequestError,
    onDataItem,
    messageApi,
    setLoading,
    setCalendarEvents,
    startDate,
    endDate,
  ]);

  const handleDatesSet = useCallback(
    (dateInfo) => {
      if (setStartDate && setEndDate) {
        setStartDate(dateInfo.startStr);
        setEndDate(dateInfo.endStr);
        setLoading(true);
      }
    },
    [setStartDate, setEndDate, setLoading]
  );

  // Handle data request on component mount and when dates or loading state change
  useEffect(() => {
    if (onDataRequest && startDate && endDate && loading) {
      handleDataRequest();
    }
  }, [handleDataRequest, onDataRequest, startDate, endDate, loading]);

  // Return the component
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
        events={calendarEvents}
      />
    </>
  );
}
