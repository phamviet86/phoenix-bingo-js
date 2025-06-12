import {
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormSelect,
} from "@ant-design/pro-form";

export function SchedulesColumns(params) {
  const { scheduleStatus, shiftSelection, roomSelection } = params;
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
      valueType: "select",
      valueEnum: shiftSelection?.enums,
      sorter: { multiple: 1 },
    },
    {
      title: "Phòng học",
      dataIndex: "room_id",
      valueType: "select",
      valueEnum: roomSelection?.enums,
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày học",
      dataIndex: "schedule_date",
      valueType: "date",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái",
      dataIndex: "schedule_status_id",
      valueType: "select",
      valueEnum: scheduleStatus?.enums,
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

export function SchedulesFields(params) {
  const { scheduleStatus, shiftSelection, roomSelection } = params;
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="section_id" label="ID lộ trình" hidden disabled />
      <ProFormText name="lesson_id" label="ID bài học" hidden disabled />

      <ProFormDatePicker
        name="schedule_date"
        label="Ngày học"
        placeholder="Chọn ngày học"
        rules={[{ required: true }]}
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="shift_id"
        label="Ca học"
        placeholder="Chọn ca học"
        options={shiftSelection?.options}
        rules={[{ required: true }]}
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="room_id"
        label="Phòng học"
        placeholder="Chọn phòng học"
        options={roomSelection?.options}
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormSelect
        name="schedule_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        options={scheduleStatus?.options}
        rules={[{ required: true }]}
        width="100%"
        colProps={{ xs: 12 }}
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
