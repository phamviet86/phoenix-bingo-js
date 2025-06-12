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
  SchedulesColumns,
  SchedulesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
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
  const { scheduleStatus } = usePageContext();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        scheduleForm.setTitle("Tạo lịch học");
        scheduleForm.open({});
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
                onClick={() => scheduleInfo.open(record)}
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
                  scheduleForm.open(record);
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
        dataSource={scheduleInfo.record}
        drawerProps={{
          title: "Thông tin lịch học",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                scheduleInfo.close();
                scheduleForm.setTitle("Sửa lịch học");
                scheduleForm.open(scheduleInfo.record);
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
    />
  );
}
