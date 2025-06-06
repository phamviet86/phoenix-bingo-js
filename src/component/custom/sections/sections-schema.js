import {
  ProForm,
  ProFormText,
  ProFormDateTimePicker,
} from "@ant-design/pro-form";

export function SectionsColumns() {
  return [
    {
      title: "Giáo trình",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "section_start_date",
      valueType: "dateTime",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "section_end_date",
      valueType: "dateTime",
      sorter: { multiple: 1 },
    },
    {
      title: "Học phí",
      dataIndex: "section_fee",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Tổng học phí",
      dataIndex: "section_total_fee",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function SectionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="class_id"
        label="Lớp học"
        placeholder="Nhập ID lớp học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="module_id"
        label="Môn học"
        placeholder="Nhập ID môn học"
        rules={[{ required: true }]}
      />
      <ProFormDateTimePicker
        name="section_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
      />
      <ProFormDateTimePicker
        name="section_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
      />
      <ProFormText
        name="section_fee"
        label="Học phí"
        placeholder="Nhập học phí"
      />
      <ProFormText
        name="section_total_fee"
        label="Tổng học phí"
        placeholder="Nhập tổng học phí"
      />
    </ProForm.Group>
  );
}
