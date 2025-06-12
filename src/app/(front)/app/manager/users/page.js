"use client";

import {
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  UsersTable,
  UsersInfo,
  UsersForm,
  UsersColumns,
  UsersFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";
import { renderUserAvatar } from "@/lib/util/render-util";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const { userStatus, roleSelection } = usePageContext();
  const userTable = useTable();
  const userInfo = useInfo();
  const userForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => userForm.open({})}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <UsersTable
        tableHook={userTable}
        columns={UsersColumns({ userStatus, roleSelection })}
        leftColumns={[
          {
            title: "Avatar",
            width: 80,
            render: (_, record) => renderUserAvatar(record),
            onCell: (record) => ({
              onClick: () => {
                userInfo.setRecord(record);
                userInfo.open();
              },
            }),
            hideInDescriptions: true,
            search: false,
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
      <UsersInfo
        infoHook={userInfo}
        columns={UsersColumns({ userStatus, roleSelection })}
        dataSource={userInfo.record}
        drawerProps={{
          title: "Thông tin",
          extra: [
            <DetailButton
              key="detail-button"
              id={userInfo.record.id}
              label="Chi tiết"
              icon={<EyeOutlined />}
              variant="filled"
              onClick={() => userInfo.close()}
            />,
          ],
        }}
      />
      <UsersForm
        formHook={userForm}
        fields={UsersFields({ userStatus })}
        onDataSubmitSuccess={() => userTable.reload()}
        title="Tạo người dùng"
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Người dùng" }]}
      title="Quản lý người dùng"
      extra={pageButton}
      content={pageContent}
    />
  );
}
