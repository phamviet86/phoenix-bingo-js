import { ProForm, ProFormText, ProFormSelect, ProFormDatePicker } from "@ant-design/pro-form";

export function EnrollmentsColumns() {
  return [
    {
      title: "ID",
      dataIndex: "id",
      valueType: "text",
      search: false,
      width: 80,
    },
    {
      title: "Tên học viên",
      dataIndex: "user_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Tên module",
      dataIndex: "module_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Tên khóa học",
      dataIndex: "course_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Tên lớp",
      dataIndex: "class_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mã lớp",
      dataIndex: "class_code",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Trạng thái ghi danh",
      dataIndex: "enrollment_status_dynamic",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Số tiền thanh toán",
      dataIndex: "enrollment_payment_amount",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Số tiền giảm giá",
      dataIndex: "enrollment_payment_discount",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "enrollment_start_date",
      valueType: "dateTime",
      sorter: { multiple: 1 },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "enrollment_end_date",
      valueType: "dateTime",
      sorter: { multiple: 1 },
    },
  ];
}

export function EnrollmentsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormSelect
        name="user_id"
        label="Học viên"
        placeholder="Chọn học viên"
        rules={[{ required: true }]}
        request={async () => {
          // This should be replaced with actual API call to get users
          return [];
        }}
      />
      <ProFormSelect
        name="module_id"
        label="Module"
        placeholder="Chọn module"
        rules={[{ required: true }]}
        request={async () => {
          // This should be replaced with actual API call to get modules
          return [];
        }}
      />
      <ProFormSelect
        name="section_id"
        label="Lớp học"
        placeholder="Chọn lớp học"
        request={async () => {
          // This should be replaced with actual API call to get sections
          return [];
        }}
      />
      <ProFormSelect
        name="enrollment_type_id"
        label="Loại ghi danh"
        placeholder="Chọn loại ghi danh"
        rules={[{ required: true }]}
        request={async () => {
          // This should be replaced with actual API call to get enrollment types
          return [];
        }}
      />
      <ProFormSelect
        name="enrollment_payment_type_id"
        label="Loại thanh toán"
        placeholder="Chọn loại thanh toán"
        request={async () => {
          // This should be replaced with actual API call to get payment types
          return [];
        }}
      />
      <ProFormText
        name="enrollment_payment_amount"
        label="Số tiền thanh toán"
        placeholder="Nhập số tiền thanh toán"
      />
      <ProFormText
        name="enrollment_payment_discount"
        label="Số tiền giảm giá"
        placeholder="Nhập số tiền giảm giá"
      />
      <ProFormDatePicker
        name="enrollment_start_date"
        label="Ngày bắt đầu"
        placeholder="Chọn ngày bắt đầu"
      />
      <ProFormDatePicker
        name="enrollment_end_date"
        label="Ngày kết thúc"
        placeholder="Chọn ngày kết thúc"
      />
    </ProForm.Group>
  );
}
