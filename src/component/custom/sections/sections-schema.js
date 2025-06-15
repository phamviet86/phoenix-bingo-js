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
      dataIndex: "section_status",
      valueType: "select",
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

export function SelectionSectionsColumns() {
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
      dataIndex: "section_status",
      valueType: "select",
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
  ];
}

export function SectionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText name="class_id" label="ID lớp học" hidden disabled />
      <ProFormText name="module_id" label="ID Học phần" hidden disabled />
      <ProFormText
        name="class_name"
        label="Lớp học"
        colProps={{ xs: 12 }}
        disabled
      />
      <ProFormText
        name="course_name"
        label="Giáo trình"
        colProps={{ xs: 12 }}
        disabled
      />
      <ProFormText
        name="module_name"
        label="Học phần"
        colProps={{ xs: 12 }}
        disabled
      />
      <ProFormText
        name="section_status"
        label="Trạng thái"
        colProps={{ xs: 12 }}
        disabled
      />
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

export function ScheduleSectionsColumns() {
  return [
    {
      title: "Lớp học",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space wrap>
            <Typography.Text strong>{record.class_name}</Typography.Text>
            <Typography.Text>{record.module_name}</Typography.Text>
          </Space>
          <Typography.Text type="secondary">
            {record.course_name}
          </Typography.Text>
        </Space>
      ),
      search: false,
      hideInDescriptions: true,
    },
    {
      title: "Lớp học",
      dataIndex: "class_name",
      valueType: "text",
      sorter: { multiple: 1 },
      hidden: true,
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
      dataIndex: "section_status",
      valueType: "select",
      valueEnum: SECTION_STATUS,
      sorter: { multiple: 1 },
      search: false,
      responsive: ["lg"],
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
  ];
}
