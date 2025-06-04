// path: @/component/custom/lessons/lessons-schema.js

import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
} from "@ant-design/pro-form";
import { fetchOption } from "@/lib/util/fetch-util";

export function LessonsColumns(params) {
  const { courseId } = params;

  return [
    {
      title: "Học phần",
      dataIndex: "module_id",
      valueType: "select",
      sorter: { multiple: 1 },
      request: (params) =>
        fetchOption("/api/modules", params, {
          label: "module_name",
          value: "id",
        }),
      params: {
        course_id_e: courseId,
      },
      responsive: ["sm"],
    },
    {
      title: "Bài giảng",
      dataIndex: "lesson_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "STT",
      dataIndex: "lesson_no",
      valueType: "text",
      search: false,
      responsive: ["lg"],
    },
    {
      title: "Mô tả",
      dataIndex: "lesson_desc",
      valueType: "textarea",
      ellipsis: true,
      search: false,
      responsive: ["lg"],
    },
  ];
}

export function LessonsFields(params) {
  const { courseId } = params;

  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormSelect
        name="module_id"
        label="Học phần"
        placeholder="Chọn học phần"
        rules={[{ required: true }]}
        request={(params) =>
          fetchOption("/api/modules", params, {
            label: "module_name",
            value: "id",
          })
        }
        params={{
          course_id_e: courseId,
        }}
      />
      <ProFormText
        name="lesson_name"
        label="Tên bài giảng"
        placeholder="Nhập tên bài giảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="lesson_no"
        label="Số thứ tự"
        placeholder="Nhập số thứ tự"
      />
      <ProFormTextArea
        name="lesson_desc"
        label="Mô tả"
        placeholder="Nhập mô tả"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
