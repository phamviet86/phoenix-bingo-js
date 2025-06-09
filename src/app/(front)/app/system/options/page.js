"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  OptionsTable,
  OptionsInfo,
  OptionsForm,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const optionTable = useTable();
  const optionInfo = useInfo();
  const optionForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        optionForm.setTitle("Tạo tùy chọn");
        optionForm.open({});
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionsTable
        tableHook={optionTable}
        columns={OptionsColumns()}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => optionInfo.open(record)}
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
                  optionForm.setTitle("Sửa tùy chọn");
                  optionForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <OptionsInfo
        infoHook={optionInfo}
        columns={OptionsColumns()}
        dataSource={optionInfo.record}
        drawerProps={{
          title: "Thông tin tùy chọn",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                optionInfo.close();
                optionForm.setTitle("Sửa tùy chọn");
                optionForm.open(optionInfo.record);
              }}
            />,
          ],
        }}
      />
      <OptionsForm
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionTable.reload()}
        initialValues={optionForm.record}
        title={optionForm.title}
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Tùy chọn" }]}
      title="Quản lý tùy chọn"
      extra={pageButton}
      content={pageContent}
    />
  );
}
