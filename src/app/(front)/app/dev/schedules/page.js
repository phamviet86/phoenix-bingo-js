"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  SchedulesTable,
  SchedulesInfo,
  SchedulesForm,
  SchedulesCalendar,
  SchedulesColumns,
  SchedulesFields,
  ScheduleSectionsTable,
  ScheduleSectionsColumns,
} from "@/component/custom";
import { useTable, useInfo, useForm, useCalendar } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { scheduleStatus, shiftSelection, roomSelection } = usePageContext();
  const scheduleCalendar = useCalendar();
  const scheduleInfo = useInfo();
  const scheduleForm = useForm();
  const sectionTable = useTable();

  const pageButton = [];

  const pageContent = (
    <ProCard boxShadow>
      <ScheduleSectionsTable
        tableHook={sectionTable}
        columns={ScheduleSectionsColumns()}
        dateRange={[scheduleCalendar.startDate, scheduleCalendar.endDate]}
        rightColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<PlusOutlined />}
                variant="link"
                onClick={() => {
                  scheduleForm.setTitle("Thêm lịch học");
                  scheduleForm.setInitialValues({
                    section_id: record.id,
                    class_name: record.class_name,
                    module_name: record.module_name,
                  });
                  scheduleForm.open();
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <SchedulesInfo
        infoHook={scheduleInfo}
        columns={SchedulesColumns({
          scheduleStatus,
          shiftSelection,
          roomSelection,
        })}
        onDataRequestSuccess={(result) => {
          scheduleInfo.setDataSource(result?.data?.[0]);
        }}
        params={scheduleInfo.params}
        drawerProps={{
          title: "Thông tin lịch học",
          extra: [
            <Button
              key="edit-button"
              label="Sửa"
              icon={<EditOutlined />}
              variant="filled"
              onClick={() => {
                scheduleInfo.close();
                scheduleForm.setTitle("Sửa lịch học");
                scheduleForm.setInitialValues(scheduleInfo.dataSource);
                scheduleForm.open();
              }}
            />,
          ],
        }}
      />
      <SchedulesForm
        formHook={scheduleForm}
        fields={SchedulesFields({
          scheduleStatus,
          shiftSelection,
          roomSelection,
        })}
        initialValues={scheduleForm.initialValues}
        title={scheduleForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Lịch học" }]}
      title="Quản lý lịch học"
      extra={pageButton}
      content={pageContent}
    >
      <ProCard boxShadow>
        <SchedulesCalendar
          calendarHook={scheduleCalendar}
          params={{
            schedule_date: [
              scheduleCalendar.startDate,
              scheduleCalendar.endDate,
            ],
            ...sectionTable.params,
          }}
          eventClick={(clickInfo) => {
            scheduleInfo.setParams({ id: clickInfo.event.id });
            scheduleInfo.open();
          }}
        />
      </ProCard>
    </PageContainer>
  );
}
