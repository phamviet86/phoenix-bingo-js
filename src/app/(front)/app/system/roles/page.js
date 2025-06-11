"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  RolesTable,
  RolesInfo,
  RolesForm,
  RolesColumns,
  RolesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const roleTable = useTable();
  const roleInfo = useInfo();
  const roleForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        roleForm.setTitle("Tạo vai trò");
        roleForm.open({});
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RolesTable
        tableHook={roleTable}
        columns={RolesColumns()}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => roleInfo.open(record)}
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
                  roleForm.setTitle("Sửa vai trò");
                  roleForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <RolesInfo
        infoHook={roleInfo}
        columns={RolesColumns()}
        dataSource={roleInfo.record}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <Button
              key="edit-button"
              label="Sửa"
              icon={<EditOutlined />}
              variant="filled"
              onClick={() => {
                roleInfo.close();
                roleForm.setTitle("Sửa vai trò");
                roleForm.open(roleInfo.record);
              }}
            />,
          ],
        }}
      />
      <RolesForm
        formHook={roleForm}
        fields={RolesFields()}
        onDataSubmitSuccess={() => roleTable.reload()}
        initialValues={roleForm.record}
        title={roleForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Vai trò" }]}
      title="Quản lý vai trò"
      extra={pageButton}
      content={pageContent}
    />
  );
}
