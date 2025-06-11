"use client";

import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import { FullCalendar } from "@/component/common/full-calendar";
import { useCalendar } from "@/component/hook/useCalendar";
import { fetchList, fetchPost, fetchDelete } from "@/lib/util/fetch-util";

const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "Meeting with Team",
    start: "2025-06-15T10:00:00",
    end: "2025-06-15T11:00:00",
    backgroundColor: "#1890ff",
  },
  {
    id: "2",
    title: "Project Deadline",
    start: "2025-06-20",
    backgroundColor: "#f5222d",
  },
  {
    id: "3",
    title: "Conference Call",
    start: "2025-06-25T14:30:00",
    end: "2025-06-25T15:30:00",
    backgroundColor: "#52c41a",
  },
  {
    id: "4",
    title: "Training Session",
    start: "2025-06-28T09:00:00",
    end: "2025-06-28T17:00:00",
    backgroundColor: "#722ed1",
  },
];

export default function Page() {
  const calendarHook = useCalendar();
  const { reload, startDate, endDate } = calendarHook;

  const handleEventClick = (clickInfo) => {
    alert(`Event: ${clickInfo.event.title}`);
  };

  return (
    <PageContainer
      items={[{ title: "Dev", path: "/app/dev" }, { title: "Calendar" }]}
      title="Calendar Sample"
    >
      <ProCard boxShadow>
        <ProCard
          title="Calendar Controls"
          style={{ marginBottom: 16 }}
          extra={[
            <Button
              key="reload-button"
              label="Reload Calendar"
              onClick={reload}
              variant="outlined"
            />,
          ]}
        >
          <div style={{ marginBottom: 16 }}>
            <strong>Current Date Range:</strong>{" "}
            {startDate && endDate ? (
              <span>
                {new Date(startDate).toLocaleDateString()} -{" "}
                {new Date(endDate).toLocaleDateString()}
              </span>
            ) : (
              <span>Not set</span>
            )}
          </div>
          <div>
            <strong>Sample Events:</strong> {SAMPLE_EVENTS.length} events loaded
          </div>
        </ProCard>

        <ProCard title="FullCalendar Demo">
          <FullCalendar
            calendarHook={calendarHook}
            events={SAMPLE_EVENTS}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            dayMaxEvents={3}
            height="600px"
            eventDisplay="block"
            displayEventTime={true}
            onDataRequest={(start, end) =>
              fetchList("/api/sections", { section_start_date: [start, end] })
            }
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
