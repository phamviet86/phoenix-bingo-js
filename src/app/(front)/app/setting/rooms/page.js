"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  RoomTable,
  RoomInfo,
  RoomFormCreate,
  RoomFormEdit,
  RoomsColumns,
  RoomsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const roomTable = useTable();
  const roomInfo = useInfo();
  const roomForm = useForm();

  const pageButton = [
    <RoomFormCreate
      key="room-form-create"
      fields={RoomsFields()}
      onDataSubmitSuccess={() => roomTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RoomTable
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
                onClick={() => roomInfo.open(record)}
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
                  roomForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <RoomInfo
        infoHook={roomInfo}
        columns={RoomsColumns()}
        dataSource={roomInfo.record}
        drawerProps={{
          title: "Thông tin phòng học",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                roomInfo.close();
                roomForm.open(roomInfo.record);
              }}
            />,
          ],
        }}
      />
      <RoomFormEdit
        formHook={roomForm}
        fields={RoomsFields()}
        onDataSubmitSuccess={() => roomTable.reload()}
        initialValues={roomForm.record}
        id={roomForm.record.id}
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
