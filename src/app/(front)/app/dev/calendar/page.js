"use client";

import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import { FullCalendar } from "@/component/common/full-calendar";
import { useCalendar } from "@/component/hook/useCalendar";
import { fetchList } from "@/lib/util/fetch-util";

export default function Page() {
  const calendarHook = useCalendar();
  const { reload, startDate, endDate, loading } = calendarHook;

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
                {` (Loading: ${loading ? "Yes" : "No"})`}
              </span>
            ) : (
              <span>Not set</span>
            )}
          </div>
        </ProCard>

        <ProCard title="FullCalendar Demo">
          <FullCalendar
            calendarHook={calendarHook}
            // events={SAMPLE_EVENTS}
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
            onDataRequest={(params) => fetchList("/api/sections", params)}
            params={{ section_start_date: [startDate, endDate] }}
            onDataItem={{
              id: "id",
              title: "class_name",
              startDate: "section_start_date",
              backgroundColor: "class_name",
              extendedProps: {
                id: "id",
                className: "class_name",
                sectionStartDate: "section_start_date",
                sectionEndDate: "section_end_date",
                sectionStatus: "section_status",
              },
            }}
            eventContent={(info) => {
              const props = info.event.extendedProps;
              return (
                <div>
                  <strong>{props.className}</strong>
                  <br />
                  <span>
                    {new Date(props.sectionStartDate).toLocaleDateString()} -{" "}
                    {props.sectionStatus ? props.sectionStatus : "Ongoing"}
                  </span>
                </div>
              );
            }}
          />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
}
