import {
  ProForm,
  ProFormText,
  ProFormDatePicker,
  ProFormMoney,
} from "@ant-design/pro-form";
import { Space, Typography } from "antd";
import { SECTION_STATUS } from "@/component/config/enum-config";

export function SectionsColumns() {
  return [
    {
      title: "Học phần",
      render: (_, record) => (
        <Space wrap>
          <Typography.Text strong>{record.course_name}</Typography.Text>
          <Typography.Text>{record.module_name}</Typography.Text>
        </Space>
      ),
      search: false,
      hideInDescriptions: true,
    },
    {
      title: "Giáo trình",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Học phần",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "section_status_dynamic",
      valueType: "text",
      valueEnum: SECTION_STATUS,
      sorter: { multiple: 1 },
    },
    {
      title: "Bắt đầu",
      dataIndex: "section_start_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["md"],
    },
    {
      title: "Kết thúc",
      dataIndex: "section_end_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["md"],
    },
    {
      title: "Học phí",
      dataIndex: "section_fee",
      valueType: "money",
      sorter: { multiple: 1 },
      search: false,
      fieldProps: {
        precision: 0,
      },
      responsive: ["lg"],
    },
    {
      title: "Tổng học phí",
      dataIndex: "section_total_fee",
      valueType: "money",
      sorter: { multiple: 1 },
      search: false,
      fieldProps: {
        precision: 0,
      },
      responsive: ["lg"],
    },
  ];
}

export function SectionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="class_id" label="ID lớp học" hidden disabled />
      <ProFormText name="module_id" label="ID Học phần" hidden disabled />
      <ProFormDatePicker
        name="section_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormDatePicker
        name="section_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormMoney
        name="section_fee"
        label="Học phí"
        placeholder="Nhập học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
        precision={0}
      />
      <ProFormMoney
        name="section_total_fee"
        label="Tổng học phí"
        placeholder="Nhập tổng học phí"
        locale="vn-VN"
        width="100%"
        colProps={{ xs: 12 }}
        precision={0}
      />
    </ProForm.Group>
  );
}
