"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  CourseTable,
  CourseInfo,
  CourseFormCreate,
  CourseFormEdit,
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
  const courseTable = useTable();
  const courseInfo = useInfo();
  const courseForm = useForm();
  const { courseStatus } = usePageContext();

  const pageButton = [
    <CourseFormCreate
      fields={CoursesFields({ courseStatus })}
      onDataSubmitSuccess={() => courseTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <CourseTable
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
                onClick={() => courseInfo.open(record)}
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
                  courseForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <CourseInfo
        infoHook={courseInfo}
        columns={CoursesColumns({ courseStatus })}
        dataSource={courseInfo.record}
        drawerProps={{
          title: "Thông tin khóa học",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                courseInfo.close();
                courseForm.open(courseInfo.record);
              }}
            />,
          ],
        }}
      />
      <CourseFormEdit
        formHook={courseForm}
        fields={CoursesFields({ courseStatus })}
        onDataSubmitSuccess={() => courseTable.reload()}
        initialValues={courseForm.record}
        id={courseForm.record.id}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Khóa học" }]}
      title="Quản lý khóa học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
