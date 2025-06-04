// path: @/component/custom/shifts/shifts-schema.js

import { ProForm, ProFormText, ProFormTimePicker } from "@ant-design/pro-form";

export function ShiftsColumns() {
  return [
    {
      title: "Ca học",
      dataIndex: "shift_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "shift_start_time",
      valueType: "time",
      sorter: { multiple: 1 },
      responsive: ["md"],
      search: false,
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "shift_end_time",
      valueType: "time",
      sorter: { multiple: 1 },
      responsive: ["md"],
      search: false,
    },
  ];
}

export function ShiftsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="shift_name"
        label="Tên ca học"
        placeholder="Nhập tên ca học"
        rules={[{ required: true }]}
      />
      <ProFormTimePicker
        name="shift_start_time"
        label="Giờ bắt đầu"
        placeholder="Chọn giờ bắt đầu"
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
        width="100%"
        fieldProps={{
          format: "HH:mm",
        }}
      />
      <ProFormTimePicker
        name="shift_end_time"
        label="Giờ kết thúc"
        placeholder="Chọn giờ kết thúc"
        rules={[{ required: true }]}
        colProps={{ xs: 12 }}
        width="100%"
        fieldProps={{
          format: "HH:mm",
        }}
      />
    </ProForm.Group>
  );
}
