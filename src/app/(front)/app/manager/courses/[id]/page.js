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
  ModuleFormCreate,
  ModuleFormEdit,
  ModulesColumns,
  ModulesFields,
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
  const { id: courseId } = use(params);
  const { courseStatus } = usePageContext();

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
          <ModuleFormCreate
            key="create-module-form"
            fields={ModulesFields()}
            onDataSubmitSuccess={() => moduleTable.reload()}
            initialValues={{ course_id: courseId }}
            trigger={
              <Button
                key="create-button"
                label="Tạo mới"
                variant="filled"
                icon={<PlusOutlined />}
              />
            }
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
                  moduleForm.open(moduleInfo.record);
                }}
              />,
            ],
          }}
        />
        <ModuleFormEdit
          formHook={moduleForm}
          fields={ModulesFields()}
          onDataSubmitSuccess={() => moduleTable.reload()}
          initialValues={moduleForm.record}
          // id={moduleForm.record.id}
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
      tabList={[moduleTab]}
    />
  );
}
