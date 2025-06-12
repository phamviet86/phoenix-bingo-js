import { Space, Typography } from "antd";
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormMoney,
} from "@ant-design/pro-form";
import { ENROLLMENT_STATUS } from "@/component/config/enum-config";
import { renderTagFromEnum } from "@/lib/util/render-util";

export function EnrollmentsColumns(params) {
  const { enrollmentType, enrollmentPaymentType } = params;

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
      title: "Nhân viên",
      dataIndex: "user_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Công việc",
      dataIndex: "enrollment_type_id",
      valueType: "select",
      valueEnum: enrollmentType?.enums,
      sorter: { multiple: 1 },
      render: (_, record) =>
        renderTagFromEnum(record.enrollment_type_id, enrollmentType?.enums),
    },
    {
      title: "Trạng thái",
      dataIndex: "enrollment_status",
      valueType: "select",
      valueEnum: ENROLLMENT_STATUS,
      sorter: { multiple: 1 },
    },
    {
      title: "Bắt đầu",
      dataIndex: "enrollment_start_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["lg"],
    },
    {
      title: "Kết thúc",
      dataIndex: "enrollment_end_date",
      valueType: "date",
      sorter: { multiple: 1 },
      search: false,
      responsive: ["lg"],
    },
    {
      title: "Trả lương",
      dataIndex: "enrollment_payment_type_id",
      valueType: "select",
      valueEnum: enrollmentPaymentType?.enums,
      sorter: { multiple: 1 },
      search: false,
      responsive: ["xl"],
    },
    {
      title: "Sô tiền",
      dataIndex: "enrollment_payment_amount",
      valueType: "money",
      sorter: { multiple: 1 },
      search: false,
      fieldProps: {
        precision: 0,
      },
      responsive: ["xl"],
    },
  ];
}

export function EnrollmentsFields(params) {
  const { enrollmentType, enrollmentPaymentType } = params;
  return (
    <>
      <ProForm.Group>
        <ProFormText name="id" label="ID" hidden disabled />
        <ProFormText name="user_id" label="ID người dùng" hidden disabled />
        <ProFormText name="module_id" label="ID học phần" hidden disabled />
        <ProFormText name="section_id" label="ID lộ trình" hidden disabled />

        <ProFormText
          name="course_name"
          label="Giáo trình"
          disabled
          colProps={{ xs: 12 }}
        />
        <ProFormText
          name="module_name"
          label="Học phần"
          disabled
          colProps={{ xs: 12 }}
        />
        <ProFormText
          name="user_name"
          label="Tên người dùng"
          disabled
          colProps={{ xs: 12 }}
        />
        <ProFormSelect
          name="enrollment_type_id"
          label="Công việc"
          placeholder="Chọn loại công việc"
          options={enrollmentType?.options}
          disabled
          colProps={{ xs: 12 }}
        />

        <ProFormDatePicker
          name="enrollment_start_date"
          label="Ngày bắt đầu"
          placeholder="Chọn ngày bắt đầu"
          width="100%"
          colProps={{ xs: 12 }}
        />
        <ProFormDatePicker
          name="enrollment_end_date"
          label="Ngày kết thúc"
          placeholder="Chọn ngày kết thúc"
          width="100%"
          colProps={{ xs: 12 }}
        />
        <ProFormSelect
          name="enrollment_payment_type_id"
          label="Trả lương"
          placeholder="Chọn hình thức"
          options={enrollmentPaymentType?.options}
          colProps={{ xs: 12 }}
        />
        <ProFormMoney
          name="enrollment_payment_amount"
          label="Số tiền"
          placeholder="Nhập số tiền"
          locale="vn-VN"
          width="100%"
          colProps={{ xs: 12 }}
          precision={0}
        />
      </ProForm.Group>
    </>
  );
}
