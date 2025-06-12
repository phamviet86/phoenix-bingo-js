"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  RoomsTable,
  RoomsInfo,
  RoomsForm,
  RoomsColumns,
  RoomsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const roomTable = useTable();
  const roomInfo = useInfo();
  const roomForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        roomForm.setTitle("Tạo phòng học");
        roomForm.setRecord({});
        roomForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RoomsTable
        tableHook={roomTable}
        columns={RoomsColumns()}
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
                  roomInfo.setRecord(record);
                  roomInfo.open();
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
                  roomForm.setTitle("Sửa phòng học");
                  roomForm.setRecord(record);
                  roomForm.open();
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <RoomsInfo
        infoHook={roomInfo}
        columns={RoomsColumns()}
        dataSource={roomInfo.record}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <Button
              key="edit-button"
              label="Sửa"
              icon={<EditOutlined />}
              variant="filled"
              onClick={() => {
                roomInfo.close();
                roomForm.setTitle("Sửa phòng học");
                roomForm.setRecord(roomInfo.record);
                roomForm.open();
              }}
            />,
          ],
        }}
      />
      <RoomsForm
        formHook={roomForm}
        fields={RoomsFields()}
        onDataSubmitSuccess={() => roomTable.reload()}
        initialValues={roomForm.record}
        title={roomForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Phòng học" }]}
      title="Quản lý phòng học"
      extra={pageButton}
      content={pageContent}
    />
  );
}
