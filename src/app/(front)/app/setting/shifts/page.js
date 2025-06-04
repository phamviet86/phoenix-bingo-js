"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  ShiftTable,
  ShiftInfo,
  ShiftForm,
  ShiftsColumns,
  ShiftsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const shiftTable = useTable();
  const shiftInfo = useInfo();
  const shiftForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        shiftForm.setTitle("Tạo ca học");
        shiftForm.open({});
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ShiftTable
        tableHook={shiftTable}
        columns={ShiftsColumns()}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => shiftInfo.open(record)}
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
                  shiftForm.setTitle("Sửa ca học");
                  shiftForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <ShiftInfo
        infoHook={shiftInfo}
        columns={ShiftsColumns()}
        dataSource={shiftInfo.record}
        drawerProps={{
          title: "Thông tin giờ học",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                shiftInfo.close();
                shiftForm.setTitle("Sửa ca học");
                shiftForm.open(shiftInfo.record);
              }}
            />,
          ],
        }}
      />
      <ShiftForm
        formHook={shiftForm}
        fields={ShiftsFields()}
        onDataSubmitSuccess={() => shiftTable.reload()}
        initialValues={shiftForm.record}
        title={shiftForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Giờ học" }]}
      title="Quản lý giờ học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
