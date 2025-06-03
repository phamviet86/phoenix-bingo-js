import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";

export function CoursesColumns(params) {
  const { courseStatus } = params;
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
      valueType: "select",
      valueEnum: courseStatus?.enums,
      sorter: { multiple: 1 },
    },
  ];
}

export function CoursesFields(params) {
  const { courseStatus } = params;
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="course_name"
        label="Tên khóa học"
        placeholder="Nhập tên khóa học"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="course_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        options={courseStatus?.options}
      />
    </ProForm.Group>
  );
}
