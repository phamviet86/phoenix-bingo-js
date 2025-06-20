"use client";

import { useState } from "react";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  SchedulesInfo,
  SchedulesForm,
  SchedulesCalendar,
  SchedulesTransfer,
  SchedulesColumns,
  SchedulesFields,
  SectionsSummaryTable,
  SectionsSummaryColumns,
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
  const [sectionsIds, setSectionsIds] = useState([]);
  const [scheduleTransferVisible, setScheduleTransferVisible] = useState(false);

  const pageButton = [];

  const pageContent = (
    <ProCard boxShadow>
      <SchedulesCalendar
        calendarHook={scheduleCalendar}
        // hiển thị lịch học trong khoảng thời gian đã chọn (thông qua calendar: startDate, endDate)
        params={{
          schedule_date: [scheduleCalendar.startDate, scheduleCalendar.endDate],
          ...(sectionsIds.length > 0 && { section_id_in: sectionsIds }),
        }}
        eventClick={(clickInfo) => {
          scheduleInfo.setParams({ id: clickInfo.event.id });
          scheduleInfo.open();
        }}
        navLinkWeekClick={(startDate) => {
          console.log("Week start date:", startDate);
          setScheduleTransferVisible(true);
        }}
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
        onDataSubmitSuccess={() => scheduleCalendar.reload()}
      />
      <SchedulesTransfer
        open={scheduleTransferVisible}
        onOk={() => {
          setScheduleTransferVisible(false);
          scheduleCalendar.reload();
        }}
        onCancel={() => setScheduleTransferVisible(false)}
      />
    </ProCard>
  );

  // user sections tab
  const sectionTab = {
    key: "sections",
    label: "Lớp học",
    children: (
      <ProCard boxShadow title="Danh sách lớp">
        <SectionsSummaryTable
          tableHook={sectionTable}
          columns={SectionsSummaryColumns()}
          // hiển thị các lớp học có lịch học trong khoảng thời gian đã chọn (dựa vào calendar: startDate, endDate)
          dateRange={{
            startDate: scheduleCalendar.startDate,
            endDate: scheduleCalendar.endDate,
          }}
          onDataRequestSuccess={() => scheduleCalendar.reload()}
          onRowsSelect={(keys) => {
            const selectedIds = keys.map((key) => key.id);
            setSectionsIds(selectedIds);
            scheduleCalendar.reload();
          }}
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
            },
          ]}
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Lịch học" }]}
      title="Quản lý lịch học"
      extra={pageButton}
      content={pageContent}
      tabList={[sectionTab]}
    />
  );
}
