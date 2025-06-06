"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  SectionsTable,
  SectionsInfo,
  SectionsForm,
  SectionsColumns,
  SectionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const sectionsTable = useTable();
  const sectionsInfo = useInfo();
  const sectionsForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        sectionsForm.setTitle("Tạo lộ trình");
        sectionsForm.open({});
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <SectionsTable
        tableHook={sectionsTable}
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
                onClick={() => sectionsInfo.open(record)}
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
                  sectionsForm.setTitle("Sửa lộ trình");
                  sectionsForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <SectionsInfo
        infoHook={sectionsInfo}
        columns={SectionsColumns()}
        dataSource={sectionsInfo.record}
        drawerProps={{
          title: "Thông tin lộ trình",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                sectionsInfo.close();
                sectionsForm.setTitle("Sửa lộ trình");
                sectionsForm.open(sectionsInfo.record);
              }}
            />,
          ],
        }}
      />
      <SectionsForm
        formHook={sectionsForm}
        fields={SectionsFields()}
        onDataSubmitSuccess={() => sectionsTable.reload()}
        initialValues={sectionsForm.record}
        title={sectionsForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Lộ trình" }]}
      title="Quản lý lộ trình"
      extra={pageButton}
      content={pageContent}
    />
  );
}
