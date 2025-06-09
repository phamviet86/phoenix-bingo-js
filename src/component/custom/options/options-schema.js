// path: @/component/custom/options/options-schema.js

import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormColorPicker,
} from "@ant-design/pro-form";
import { COLOR_ENUM } from "@/component/config";

export function OptionsColumns() {
  return [
    {
      title: "ID",
      dataIndex: "id",
      valueType: "text",
      search: false,
      width: 80,
      responsive: ["md"],
    },
    {
      title: "Bảng",
      dataIndex: "option_table",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["lg"],
    },
    {
      title: "Cột",
      dataIndex: "option_column",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nhãn",
      dataIndex: "option_label",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Màu sắc",
      dataIndex: "option_color",
      valueType: "select",
      valueEnum: COLOR_ENUM,
      sorter: { multiple: 1 },
      responsive: ["xl"],
    },
    {
      title: "Nhóm",
      dataIndex: "option_group",
      valueType: "text",
      sorter: { multiple: 1 },
      responsive: ["xxl"],
    },
  ];
}

export function OptionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="option_table"
        label="Tên bảng"
        placeholder="Nhập tên bảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_column"
        label="Tên cột"
        placeholder="Nhập tên cột"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_label"
        label="Tên nhãn"
        placeholder="Nhập tên nhãn"
        rules={[{ required: true }]}
      />
      <ProFormSelect
        name="option_color"
        label="Màu sắc"
        placeholder="Chọn màu sắc"
        valueEnum={COLOR_ENUM}
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormColorPicker
        name="option_color"
        label="Màu sắc"
        placeholder="Chọn màu sắc"
        // valueEnum={COLOR_ENUM}
        width="100%"
        colProps={{ xs: 12 }}
      />
      <ProFormText
        name="option_group"
        label="Tên nhóm"
        placeholder="Nhập tên nhóm"
      />
    </ProForm.Group>
  );
}
