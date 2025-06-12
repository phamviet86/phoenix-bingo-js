"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  ShiftsTable,
  ShiftsInfo,
  ShiftsForm,
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
        shiftForm.setInitialValues({});
        shiftForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ShiftsTable
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
                onClick={() => {
                  shiftInfo.setDataSource(record);
                  shiftInfo.open();
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
                  shiftForm.setTitle("Sửa ca học");
                  shiftForm.setInitialValues(record);
                  shiftForm.open();
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <ShiftsInfo
        infoHook={shiftInfo}
        columns={ShiftsColumns()}
        dataSource={shiftInfo.dataSource}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <Button
              key="edit-button"
              label="Sửa"
              icon={<EditOutlined />}
              variant="filled"
              onClick={() => {
                shiftInfo.close();
                shiftForm.setTitle("Sửa ca học");
                shiftForm.setInitialValues(shiftInfo.dataSource);
                shiftForm.open();
              }}
            />,
          ],
        }}
      />
      <ShiftsForm
        formHook={shiftForm}
        fields={ShiftsFields()}
        onDataSubmitSuccess={() => shiftTable.reload()}
        initialValues={shiftForm.initialValues}
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
