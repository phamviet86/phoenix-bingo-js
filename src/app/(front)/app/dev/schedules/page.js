"use client";

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
  const scheduleTable = useTable();
  const scheduleInfo = useInfo();
  const scheduleForm = useForm();
  const scheduleCalendar = useCalendar();
  const { scheduleStatus } = usePageContext();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        scheduleForm.setTitle("Tạo lịch học");
        scheduleForm.setRecord({});
        scheduleForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <SchedulesTable
        tableHook={scheduleTable}
        columns={SchedulesColumns({ scheduleStatus })}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => {
                  scheduleInfo.setParams({ id: record.id });
                  scheduleInfo.open();
                }}
              />
            ),
          },
        ]}
        rightColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<EditOutlined />}
                variant="link"
                onClick={() => {
                  scheduleForm.setTitle("Sửa lịch học");
                  scheduleForm.setRecord(record);
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
        columns={SchedulesColumns({ scheduleStatus })}
        // dataSource={scheduleInfo.record}
        params={scheduleInfo.params}
        drawerProps={{
          title: "Thông tin lịch học",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                scheduleInfo.close();
                scheduleForm.setTitle("Sửa lịch học");
                scheduleForm.setRecord(scheduleInfo.record);
                scheduleForm.open();
              }}
            />,
          ],
        }}
      />
      <SchedulesForm
        formHook={scheduleForm}
        fields={SchedulesFields({ scheduleStatus })}
        onDataSubmitSuccess={() => scheduleTable.reload()}
        initialValues={scheduleForm.record}
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
