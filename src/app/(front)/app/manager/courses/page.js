"use client";

import {
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  CoursesTable,
  CoursesInfo,
  CoursesForm,
  CoursesColumns,
  CoursesFields,
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
  const { courseStatus } = usePageContext();
  const courseTable = useTable();
  const courseInfo = useInfo();
  const courseForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        courseForm.setInitialValues({});
        courseForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <CoursesTable
        tableHook={courseTable}
        columns={CoursesColumns({ courseStatus })}
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
                  courseInfo.setDataSource(record);
                  courseInfo.open();
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
              <DetailButton
                id={record.id}
                icon={<EyeOutlined />}
                variant="link"
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <CoursesInfo
        infoHook={courseInfo}
        columns={CoursesColumns({ courseStatus })}
        dataSource={courseInfo.dataSource}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <DetailButton
              key="detail-button"
              id={courseInfo.dataSource.id}
              label="Chi tiết"
              icon={<EyeOutlined />}
              variant="filled"
              onClick={() => courseInfo.close()}
            />,
          ],
        }}
      />
      <CoursesForm
        formHook={courseForm}
        fields={CoursesFields({ courseStatus })}
        onDataSubmitSuccess={() => courseTable.reload()}
        title="Tạo giáo trình"
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Giáo trình" }]}
      title="Quản lý giáo trình"
      extra={pageButton}
      content={pageContent}
    />
  );
}
