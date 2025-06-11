// path: @/component/hook/useCalendar.js

import { useRef, useState } from "react";

export function useCalendar() {
  const calendarRef = useRef();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const calendarApi = calendarRef.current?.getApi();

  const reload = () => {
    if (calendarApi) {
      calendarApi.reload();
    }
  };

  return {
    calendarRef,
    reload,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
}
