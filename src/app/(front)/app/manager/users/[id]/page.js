"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import {
  PageContainer,
  Button,
  BackButton,
  ResponsiveCard,
} from "@/component/common";
import {
  UsersDesc,
  UsersForm,
  UsersColumns,
  UsersFields,
  UsersPicture,
  UsersResetPassword,
  UserRoleTransfer,
} from "@/component/custom";
import { useDesc, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "../provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent({ params }) {
  const { userStatus, roleSelection } = usePageContext();
  const { id: userId } = use(params);

  // page content: users
  const userDesc = useDesc();
  const userForm = useForm();

  const pageTitle = userDesc?.record?.user_name || "Chi tiết";
  document.title = `Người dùng - ${pageTitle}`;

  const pageButton = [
    <BackButton key="back-button" />,
    <Button
      key="edit-button"
      label="Sửa"
      icon={<EditOutlined />}
      onClick={() => {
        userForm.setInitialValues(userDesc.record);
        userForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ResponsiveCard
      bordered
      splitAt="md"
      actions={[<UsersResetPassword key="reset-password" userId={userId} />]}
    >
      <ProCard
        layout="center"
        colSpan={{
          xs: 24,
          sm: 24,
          md: "290px",
          lg: "290px",
          xl: "290px",
          xxl: "290px",
        }}
      >
        <UsersPicture userAvatar={userDesc?.record?.user_avatar} />
      </ProCard>
      <ProCard>
        <UsersDesc
          descHook={userDesc}
          columns={UsersColumns({ userStatus, roleSelection })}
          params={{ id: userId }}
          onDataRequestSuccess={(result) =>
            userDesc.setRecord(result?.data?.[0])
          }
          column={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 3 }}
        />
        <UsersForm
          formHook={userForm}
          fields={UsersFields({ userStatus })}
          onDataSubmitSuccess={() => userDesc.reload()}
          initialValues={userForm.initialValues}
          title="Sửa người dùng"
        />
      </ProCard>
    </ResponsiveCard>
  );

  // user roles tab
  const userRoleTab = {
    key: "user-roles",
    label: "Phân quyền",
    children: (
      <ProCard boxShadow title="Quản lý quyền">
        <UserRoleTransfer userId={userId} />
      </ProCard>
    ),
  };

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Người dùng", path: "/app/manager/users" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
      tabList={[userRoleTab]}
    />
  );
}
