import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form";

export function ModulesColumns() {
  return [
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "module_desc",
      valueType: "textarea",
      ellipsis: true,
      search: false,
      responsive: ["md"],
    },
  ];
}

export function ModulesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="course_id" label="Khóa học" hidden disabled />
      <ProFormText
        name="module_name"
        label="Tên học phần"
        placeholder="Nhập tên học phần"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="module_desc"
        label="Mô tả"
        placeholder="Nhập mô tả học phần"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
