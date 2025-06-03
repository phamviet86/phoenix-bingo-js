"use client";

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  OptionTable,
  OptionInfo,
  OptionFormCreate,
  OptionFormEdit,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const optionTable = useTable();
  const optionInfo = useInfo();
  const optionForm = useForm();

  const pageButton = [
    <OptionFormCreate
      fields={OptionsFields()}
      onDataSubmitSuccess={() => optionTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionTable
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
                  optionForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <OptionInfo
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
                optionForm.open(optionInfo.record);
              }}
            />,
          ],
        }}
      />
      <OptionFormEdit
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionTable.reload()}
        id={optionForm.record.id}
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
