"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  CourseDesc,
  CourseFormEdit,
  CoursesColumns,
  CoursesFields,
} from "@/component/custom";
import { useTable, useDesc, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  const { courseStatus } = usePageContext();
  const courseDesc = useDesc();
  const courseForm = useForm();

  const { id: courseId } = use(params);
  const pageTitle = courseDesc?.record?.course_name || "Chi tiết";
  document.title = `Khóa học - ${pageTitle}`;

  const pageButton = [
    <CourseFormEdit
      formHook={courseForm}
      fields={CoursesFields({ courseStatus })}
      id={courseId}
      onDataSubmitSuccess={() => courseDesc.reload()}
      trigger={<Button key="edit-button" label="Sửa" icon={<EditOutlined />} />}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <CourseDesc
        descHook={courseDesc}
        columns={CoursesColumns({ courseStatus })}
        params={{ id: courseId }}
        onDataRequestSuccess={(result) =>
          courseDesc.setRecord(result?.data?.[0])
        }
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Khóa học", path: "/app/manager/courses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
