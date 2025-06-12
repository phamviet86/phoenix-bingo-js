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
  CoursesDesc,
  CoursesForm,
  CoursesColumns,
  CoursesFields,
  ModulesTable,
  ModulesInfo,
  ModulesForm,
  ModulesColumns,
  ModulesFields,
  LessonsTable,
  LessonsInfo,
  LessonsForm,
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

  // page content: courses
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
      onClick={() => {
        courseForm.setRecord(courseDesc.record);
        courseForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <CoursesDesc
        descHook={courseDesc}
        columns={CoursesColumns({ courseStatus })}
        params={{ id: courseId }}
        onDataRequestSuccess={(result) => {
          courseDesc.setRecord(result?.data?.[0]);
        }}
      />
      <CoursesForm
        formHook={courseForm}
        fields={CoursesFields({ courseStatus })}
        onDataSubmitSuccess={() => courseDesc.reload()}
        initialValues={courseForm.record}
        title="Sửa giáo trình"
      />
    </ProCard>
  );

  // modules tab
  const moduleTable = useTable();
  const moduleInfo = useInfo();
  const moduleForm = useForm();

  const moduleTab = {
    key: "modules",
    tab: "Học phần",
    children: (
      <ProCard
        title="Quản lý học phần"
        boxShadow
        extra={[
          <Button
            key="create-button"
            label="Thêm"
            icon={<PlusOutlined />}
            variant="filled"
            onClick={() => {
              moduleForm.setTitle("Tạo học phần");
              moduleForm.setRecord({ course_id: courseId });
              moduleForm.open();
            }}
          />,
        ]}
      >
        <ModulesTable
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
                  onClick={() => {
                    moduleInfo.setRecord(record);
                    moduleInfo.open();
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
                    moduleForm.setTitle("Sửa học phần");
                    moduleForm.setRecord(record);
                    moduleForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
          params={{ course_id: courseId }}
          showSearch={false}
        />
        <ModulesInfo
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
                  moduleForm.setRecord(moduleInfo.record);
                  moduleForm.open();
                }}
              />,
            ],
          }}
        />
        <ModulesForm
          formHook={moduleForm}
          fields={ModulesFields()}
          onDataSubmitSuccess={() => moduleTable.reload()}
          initialValues={moduleForm.record}
          title={moduleForm.title}
        />
      </ProCard>
    ),
  };

  // lessons tab
  const lessonTable = useTable();
  const lessonInfo = useInfo();
  const lessonForm = useForm();

  const lessonTab = {
    key: "lessons",
    tab: "Bài giảng",
    children: (
      <ProCard
        title="Quản lý bài giảng"
        boxShadow
        extra={[
          <Button
            key="create-button"
            label="Thêm"
            icon={<PlusOutlined />}
            variant="filled"
            onClick={() => {
              lessonForm.setTitle("Tạo bài giảng");
              lessonForm.setRecord({});
              lessonForm.open();
            }}
          />,
        ]}
      >
        <LessonsTable
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
                  onClick={() => {
                    lessonInfo.setRecord(record);
                    lessonInfo.open();
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
                    lessonForm.setTitle("Sửa bài giảng");
                    lessonForm.setRecord(record);
                    lessonForm.open();
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <LessonsInfo
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
                  lessonForm.setRecord(lessonInfo.record);
                  lessonForm.open();
                }}
              />,
            ],
          }}
        />
        <LessonsForm
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
