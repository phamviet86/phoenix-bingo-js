"use client";

import { use } from "react";
import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  CourseDesc,
  CourseForm,
  CoursesColumns,
  CoursesFields,
  ModuleTable,
  ModuleInfo,
  ModuleForm,
  ModulesColumns,
  ModulesFields,
  LessonTable,
  LessonInfo,
  LessonForm,
  LessonsColumns,
  LessonsFields,
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
  const { id: courseId } = use(params);

  // course sections
  const courseDesc = useDesc();
  const courseForm = useForm();

  const pageTitle = courseDesc?.record?.course_name || "Chi tiết";
  document.title = `Giáo trình - ${pageTitle}`;

  const pageButton = [
    <BackButton key="back-button" />,
    <Button
      key="edit-button"
      label="Sửa"
      icon={<EditOutlined />}
      onClick={() => courseForm.open(courseDesc.record)}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <CourseDesc
        descHook={courseDesc}
        columns={CoursesColumns({ courseStatus })}
        params={{ id: courseId }}
        onDataRequestSuccess={(result) => {
          courseDesc.setRecord(result?.data?.[0]);
        }}
      />
      <CourseForm
        formHook={courseForm}
        fields={CoursesFields({ courseStatus })}
        onDataSubmitSuccess={() => courseDesc.reload()}
        initialValues={courseForm.record}
        title="Sửa giáo trình"
      />
    </ProCard>
  );

  // modules sections
  const moduleTable = useTable();
  const moduleInfo = useInfo();
  const moduleForm = useForm();

  const moduleTab = {
    key: "modules",
    tab: "Học phần",
    children: (
      <ProCard
        title="Danh sách học phần"
        boxShadow
        extra={[
          <Button
            key="create-button"
            label="Thêm"
            icon={<PlusOutlined />}
            variant="filled"
            onClick={() => {
              moduleForm.setTitle("Tạo học phần");
              moduleForm.open({ course_id: courseId });
            }}
          />,
        ]}
      >
        <ModuleTable
          tableHook={moduleTable}
          columns={ModulesColumns()}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => moduleInfo.open(record)}
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
                    moduleForm.setTitle("Sửa học phần");
                    moduleForm.open(record);
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
          params={{ course_id: courseId }}
          showSearch={false}
        />
        <ModuleInfo
          infoHook={moduleInfo}
          columns={ModulesColumns()}
          dataSource={moduleInfo.record}
          drawerProps={{
            title: "Thông tin học phần",
            footer: [
              <Button
                key="edit-button"
                label="Sửa"
                onClick={() => {
                  moduleInfo.close();
                  moduleForm.setTitle("Sửa học phần");
                  moduleForm.open(moduleInfo.record);
                }}
              />,
            ],
          }}
        />
        <ModuleForm
          formHook={moduleForm}
          fields={ModulesFields()}
          onDataSubmitSuccess={() => moduleTable.reload()}
          initialValues={moduleForm.record}
          title={moduleForm.title}
        />
      </ProCard>
    ),
  };

  // lessons sections
  const lessonTable = useTable();
  const lessonInfo = useInfo();
  const lessonForm = useForm();

  const lessonTab = {
    key: "lessons",
    tab: "Bài giảng",
    children: (
      <ProCard
        title="Danh sách bài giảng"
        boxShadow
        extra={[
          <Button
            key="create-button"
            label="Thêm"
            icon={<PlusOutlined />}
            variant="filled"
            onClick={() => {
              lessonForm.setTitle("Tạo bài giảng");
              lessonForm.open({});
            }}
          />,
        ]}
      >
        <LessonTable
          tableHook={lessonTable}
          columns={LessonsColumns({ courseId })}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => lessonInfo.open(record)}
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
                    lessonForm.setTitle("Sửa bài giảng");
                    lessonForm.open(record);
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <LessonInfo
          infoHook={lessonInfo}
          columns={LessonsColumns({ courseId })}
          dataSource={lessonInfo.record}
          drawerProps={{
            title: "Thông tin bài giảng",
            footer: [
              <Button
                key="edit-button"
                label="Sửa"
                onClick={() => {
                  lessonInfo.close();
                  lessonForm.setTitle("Sửa bài giảng");
                  lessonForm.open(lessonInfo.record);
                }}
              />,
            ],
          }}
        />
        <LessonForm
          formHook={lessonForm}
          fields={LessonsFields({ courseId })}
          onDataSubmitSuccess={() => lessonTable.reload()}
          initialValues={lessonForm.record}
          title={lessonForm.title}
        />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Giáo trình", path: "/app/manager/courses" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[moduleTab, lessonTab]}
    />
  );
}
