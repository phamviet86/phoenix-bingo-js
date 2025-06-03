"use client";

import {
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  CourseTable,
  CourseInfo,
  CourseFormCreate,
  CoursesColumns,
  CoursesFields,
} from "@/component/custom";
import { useTable, useInfo } from "@/component/hook";
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
      <CourseInfo
        infoHook={courseInfo}
        columns={CoursesColumns({ courseStatus })}
        dataSource={courseInfo.record}
        drawerProps={{
          title: "Thông tin khóa học",
          footer: [
            <DetailButton
              key="detail-button"
              id={courseInfo.record.id}
              label="Chi tiết"
              icon={<EyeOutlined />}
              onClick={() => courseInfo.close()}
            />,
          ],
        }}
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
