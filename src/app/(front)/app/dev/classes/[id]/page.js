"use client";

import { use } from "react";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  ClassDesc,
  ClassForm,
  ClassesColumns,
  ClassesFields,
  SectionTransfer,
} from "@/component/custom";
import { useDesc, useForm } from "@/component/hook";

export default function Page(props) {
  return <PageContent {...props} />;
}

function PageContent({ params }) {
  const { id: classId } = use(params);

  // class sections
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
      <ClassDesc
        descHook={classDesc}
        columns={ClassesColumns()}
        params={{ id: classId }}
        onDataRequestSuccess={(result) =>
          classDesc.setRecord(result?.data?.[0])
        }
      />
      <ClassForm
        formHook={classForm}
        fields={ClassesFields()}
        onDataSubmitSuccess={() => classDesc.reload()}
        initialValues={classForm.record}
        title="Sửa lớp học"
      />
    </ProCard>
  );

  // sections tab
  const sectionTab = {
    key: "sections",
    label: "Lộ trình",
    children: (
      <ProCard
        boxShadow
        title="Quản lý lộ trình"
        extra={[
          <SectionTransfer
            key="section-transfer"
            classId={classId}
            trigger={
              <Button
                key="create-button"
                label="Thêm"
                icon={<PlusOutlined />}
                variant="filled"
              />
            }
          />,
        ]}
      ></ProCard>
    ),
  };

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
      tabList={[sectionTab]}
    />
  );
}
