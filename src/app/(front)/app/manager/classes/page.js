"use client";

import {
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  ClassesTable,
  ClassesInfo,
  ClassesForm,
  ClassesColumns,
  ClassesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const classTable = useTable();
  const classInfo = useInfo();
  const classForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        classForm.setRecord({});
        classForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ClassesTable
        tableHook={classTable}
        columns={ClassesColumns()}
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
                  classInfo.setRecord(record);
                  classInfo.open();
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
      <ClassesInfo
        infoHook={classInfo}
        columns={ClassesColumns()}
        dataSource={classInfo.record}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <DetailButton
              key="detail-button"
              id={classInfo.record.id}
              label="Chi tiết"
              icon={<EyeOutlined />}
              variant="filled"
              onClick={() => classInfo.close()}
            />,
          ],
        }}
      />
      <ClassesForm
        formHook={classForm}
        fields={ClassesFields()}
        onDataSubmitSuccess={() => classTable.reload()}
        title="Tạo lớp học"
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Lớp học" }]}
      title="Quản lý lớp học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
