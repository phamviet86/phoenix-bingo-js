import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDatePicker,
} from "@ant-design/pro-form";

export function SchedulesColumns() {
  return [
    {
      title: "ID",
      dataIndex: "id",
      valueType: "text",
      search: false,
      width: 80,
    },
    {
      title: "Lớp học",
      dataIndex: "section_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Bài học",
      dataIndex: "lesson_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ca học",
      dataIndex: "shift_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Phòng học",
      dataIndex: "room_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày học",
      dataIndex: "schedule_date",
      valueType: "dateTime",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "schedule_status_id",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "schedule_desc",
      valueType: "textarea",
      sorter: { multiple: 1 },
    },
  ];
}

export function SchedulesFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="section_id"
        label="Lớp học"
        placeholder="Chọn lớp học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="lesson_id"
        label="Bài học"
        placeholder="Chọn bài học"
      />
      <ProFormText
        name="shift_id"
        label="Ca học"
        placeholder="Chọn ca học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="room_id"
        label="Phòng học"
        placeholder="Chọn phòng học"
      />
      <ProFormDatePicker
        name="schedule_date"
        label="Ngày học"
        placeholder="Chọn ngày học"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="schedule_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="schedule_desc"
        label="Mô tả"
        placeholder="Nhập mô tả lịch học"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
