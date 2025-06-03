"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  ModuleTable,
  ModuleInfo,
  ModuleFormCreate,
  ModuleFormEdit,
  ModulesColumns,
  ModulesFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";
import { PageProvider, usePageContext } from "./provider";

export default function Page(props) {
  return (
    <PageProvider>
      <PageContent {...props} />
    </PageProvider>
  );
}

function PageContent() {
  const moduleTable = useTable();
  const moduleInfo = useInfo();
  const moduleForm = useForm();
  const { courses } = usePageContext();

  const pageButton = [
    <ModuleFormCreate
      fields={ModulesFields({ courses })}
      onDataSubmitSuccess={() => moduleTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <ModuleTable
        tableHook={moduleTable}
        columns={ModulesColumns({ courses })}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => moduleInfo.open(record)}
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
                  moduleForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <ModuleInfo
        infoHook={moduleInfo}
        columns={ModulesColumns({ courses })}
        dataSource={moduleInfo.record}
        drawerProps={{
          title: "Thông tin học phần",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                moduleInfo.close();
                moduleForm.open(moduleInfo.record);
              }}
            />,
          ],
        }}
      />
      <ModuleFormEdit
        formHook={moduleForm}
        fields={ModulesFields({ courses })}
        onDataSubmitSuccess={() => moduleTable.reload()}
        id={moduleForm.record.id}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Quản lý" }, { title: "Học phần" }]}
      title="Quản lý học phần"
      extra={pageButton}
      content={pageContent}
    />
  );
}
