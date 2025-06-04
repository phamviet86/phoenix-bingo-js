// path: @/component/custom/lessons/lessons-schema.js

import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form";

export function LessonsColumns() {
  return [
    {
      title: "Module ID",
      dataIndex: "module_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Bài Giảng",
      dataIndex: "lesson_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "STT",
      dataIndex: "lesson_no",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô Tả",
      dataIndex: "lesson_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
    },
  ];
}

export function LessonsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="module_id" label="ID học phần" hidden disabled />
      <ProFormText
        name="lesson_name"
        label="Tên Bài Giảng"
        placeholder="Nhập tên bài giảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="lesson_no"
        label="Số Thứ Tự"
        placeholder="Nhập số thứ tự"
      />
      <ProFormTextArea
        name="lesson_desc"
        label="Mô Tả"
        placeholder="Nhập mô tả"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
