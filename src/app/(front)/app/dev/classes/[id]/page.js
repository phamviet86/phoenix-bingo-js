"use client";

import { use } from "react";
import {
  EditOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  ClassesDesc,
  ClassesForm,
  ClassesColumns,
  ClassesFields,
  SectionsTransfer,
  SectionsTable,
  SectionsInfo,
  SectionsForm,
  SectionsColumns,
  SectionsFields,
  EnrollmentsTable,
  EnrollmentsInfo,
  EnrollmentsForm,
  EnrollmentsAdd,
  EnrollmentsColumns,
  EnrollmentsFields,
  UsersSelectionColumns,
  SectionsSelectionColumns,
} from "@/component/custom";
import { useDesc, useForm, useTable, useInfo } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  const { userStatus, roleSelection, enrollmentType, enrollmentPaymentType } =
    usePageContext();
  const { id: classId } = use(params);

  // page content: classes
  const classDesc = useDesc();
  const classForm = useForm();

  const pageTitle = classDesc?.record?.class_name || "Chi tiết";
  document.title = `Lớp học - ${pageTitle}`;

  const pageButton = [
    <BackButton key="back-button" />,
    <Button
      key="edit-button"
      label="Sửa"
      icon={<EditOutlined />}
      onClick={() => classForm.open(classDesc.record)}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <ClassesDesc
        descHook={classDesc}
        columns={ClassesColumns()}
        params={{ id: classId }}
        onDataRequestSuccess={(result) =>
          classDesc.setRecord(result?.data?.[0])
        }
      />
      <ClassesForm
        formHook={classForm}
        fields={ClassesFields()}
        onDataSubmitSuccess={() => classDesc.reload()}
        initialValues={classForm.record}
        title="Sửa lớp học"
      />
    </ProCard>
  );

  // sections tab
  const sectionTable = useTable();
  const sectionInfo = useInfo();
  const sectionForm = useForm();

  const sectionTab = {
    key: "sections",
    label: "Lộ trình",
    children: (
      <ProCard
        boxShadow
        title="Quản lý lộ trình"
        extra={[
          <SectionsTransfer
            key="section-transfer"
            classId={classId}
            trigger={
              <Button
                key="create-button"
                label="Điều chỉnh"
                icon={<EditOutlined />}
                variant="filled"
              />
            }
            afterClose={() => sectionTable.reload()}
          />,
        ]}
      >
        <SectionsTable
          tableHook={sectionTable}
          columns={SectionsColumns()}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => sectionInfo.open(record)}
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
                    sectionForm.setTitle("Sửa lộ trình");
                    sectionForm.open(record);
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <SectionsInfo
          infoHook={sectionInfo}
          columns={SectionsColumns()}
          dataSource={sectionInfo.record}
          drawerProps={{
            title: "Thông tin",
            extra: [
              <Button
                key="edit-button"
                label="Sửa"
                icon={<EditOutlined />}
                variant="filled"
                onClick={() => {
                  sectionInfo.close();
                  sectionForm.setTitle("Sửa lộ trình");
                  sectionForm.open(sectionInfo.record);
                }}
              />,
            ],
          }}
        />
        <SectionsForm
          formHook={sectionForm}
          fields={SectionsFields()}
          onDataSubmitSuccess={() => sectionTable.reload()}
          initialValues={sectionForm.record}
          title={sectionForm.title}
        />
      </ProCard>
    ),
  };

  // enrollments tab
  const enrollmentTable = useTable();
  const enrollmentInfo = useInfo();
  const enrollmentForm = useForm();

  const enrollmentsTab = {
    key: "enrollments",
    label: "Phụ trách lớp",
    children: (
      <ProCard
        boxShadow
        extra={[
          <EnrollmentsAdd
            key="enrolment-add"
            userTableColumns={UsersSelectionColumns({
              userStatus,
              roleSelection,
            })}
            sectionTableColumns={SectionsSelectionColumns()}
            classId={classId}
            onModalOkSuccess={() => enrollmentTable.reload()}
            trigger={<Button label="Thêm" color="primary" variant="filled" />}
          />,
        ]}
      >
        <EnrollmentsTable
          tableHook={enrollmentTable}
          columns={EnrollmentsColumns({
            enrollmentType,
            enrollmentPaymentType,
          })}
          params={{ class_id: classId, enrollment_type_id_in: [8, 9] }}
          leftColumns={[
            {
              width: 56,
              align: "center",
              search: false,
              render: (_, record) => (
                <Button
                  icon={<InfoCircleOutlined />}
                  variant="link"
                  onClick={() => enrollmentInfo.open(record)}
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
                    enrollmentForm.setTitle("Sửa ghi danh");
                    enrollmentForm.open(record);
                  }}
                />
              ),
              responsive: ["md"],
            },
          ]}
        />
        <EnrollmentsInfo
          infoHook={enrollmentInfo}
          columns={EnrollmentsColumns({
            enrollmentType,
            enrollmentPaymentType,
          })}
          dataSource={enrollmentInfo.record}
          drawerProps={{
            title: "Thông tin",
            extra: [
              <Button
                key="edit-button"
                icon={<EditOutlined />}
                variant="filled"
                label="Sửa"
                onClick={() => {
                  enrollmentInfo.close();
                  enrollmentForm.setTitle("Sửa ghi danh");
                  enrollmentForm.open(enrollmentInfo.record);
                }}
              />,
            ],
          }}
        />
        <EnrollmentsForm
          formHook={enrollmentForm}
          fields={EnrollmentsFields({
            enrollmentType,
            enrollmentPaymentType,
          })}
          onDataSubmitSuccess={() => enrollmentTable.reload()}
          initialValues={enrollmentForm.record}
          title={enrollmentForm.title}
        />
      </ProCard>
    ),
  };

  // render the page
  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Lớp học", path: "/app/dev/classes" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[sectionTab, enrollmentsTab]}
    />
  );
}
