import { ProForm, ProFormText } from "@ant-design/pro-form";

export function CoursesColumns() {
  return [
    {
      title: "Tên khóa học",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "course_status_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function CoursesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="course_name"
        label="Tên khóa học"
        placeholder="Nhập tên khóa học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="course_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
      />
    </ProForm.Group>
  );
}
