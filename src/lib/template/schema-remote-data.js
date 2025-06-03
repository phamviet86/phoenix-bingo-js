import { ProForm, ProFormText, ProFormSelect } from "@ant-design/pro-form";
import { fetchOption } from "@/lib/util/fetch-util";

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
      valueType: "select",
      sorter: { multiple: 1 },
      request: (params) =>
        fetchOption("/api/options", params, {
          value: "id",
          label: "option_label",
        }),
      params: {
        option_table_e: "courses",
        option_column_e: "course_status_id",
      },
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
      <ProFormSelect
        name="course_status_id"
        label="Trạng thái"
        placeholder="Chọn trạng thái"
        rules={[{ required: true }]}
        request={(params) =>
          fetchOption("/api/options", params, {
            label: "option_label",
            value: "id",
          })
        }
        params={{
          option_table_e: "courses",
          option_column_e: "course_status_id",
        }}
      />
    </ProForm.Group>
  );
}
