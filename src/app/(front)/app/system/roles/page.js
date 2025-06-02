"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  RoleTable,
  RoleInfo,
  RoleFormCreate,
  RoleFormEdit,
  RolesColumns,
  RolesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const roleTable = useTable();
  const roleInfo = useInfo();
  const roleForm = useForm();

  const pageButton = [
    <RoleFormCreate
      fields={RolesFields()}
      onDataSubmitSuccess={() => roleTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <RoleTable
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
                  roleForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <RoleInfo
        infoHook={roleInfo}
        columns={RolesColumns()}
        dataSource={roleInfo.record}
        drawerProps={{
          title: "Thông tin vai trò",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                roleInfo.close();
                roleForm.open(roleInfo.record);
              }}
            />,
          ],
        }}
      />
      <RoleFormEdit
        formHook={roleForm}
        fields={RolesFields()}
        onDataSubmitSuccess={() => roleTable.reload()}
        initialValues={roleForm.record}
        id={roleForm.record.id}
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
