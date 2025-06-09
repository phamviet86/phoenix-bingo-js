"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  EnrollmentTable,
  EnrollmentInfo,
  EnrollmentForm,
  EnrollmentsColumns,
  EnrollmentsFields,
} from "@/component/custom/enrollments";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const enrollmentTable = useTable();
  const enrollmentInfo = useInfo();
  const enrollmentForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        enrollmentForm.setTitle("Tạo ghi danh");
        enrollmentForm.open({});
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <EnrollmentTable
        tableHook={enrollmentTable}
        columns={EnrollmentsColumns()}
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
      <EnrollmentInfo
        infoHook={enrollmentInfo}
        columns={EnrollmentsColumns()}
        dataSource={enrollmentInfo.record}
        drawerProps={{
          title: "Thông tin ghi danh",
          footer: [
            <Button
              key="edit-button"
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
      <EnrollmentForm
        formHook={enrollmentForm}
        fields={EnrollmentsFields()}
        onDataSubmitSuccess={() => enrollmentTable.reload()}
        initialValues={enrollmentForm.record}
        title={enrollmentForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Ghi danh" }]}
      title="Quản lý ghi danh"
      extra={pageButton}
      content={pageContent}
    />
  );
}
