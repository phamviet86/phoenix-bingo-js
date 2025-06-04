---
mode: "edit"
description: "Create complete schema files for Ant Design Pro component system from SQL table definition, including table column configuration and form fields."
---

## Requirements

- Create schema file from SQL table definition:
  - `{tableName}-schema.js` in `/src/component/custom/{tableName}/` directory
  - Export two functions: `[TableName]Columns` and `[TableName]Fields`
- Include component mapping based on SQL data types:
  - VARCHAR/TEXT → ProFormText/ProFormTextArea with prop `fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}`
  - INT/SERIAL → ProFormText (not ProFormDigit)
  - TIMESTAMPTZ/TIME → ProFormDatePicker/ProFormTimePicker
  - Fields NOT NULL → `rules={[{ required: true }]}`
- Follow established project patterns for:
  - Table column configuration with appropriate valueType
  - Validation based on SQL constraints
  - Import statements from Ant Design Pro
- Include appropriate table column configuration:
  - TEXT fields: `valueType: textarea`
  - VARCHAR fields: `valueType: text`
  - ID column: `search: false`, `width: 80`
  - All non-ID columns: `sorter: { multiple: 1 }`
- Hide system fields:
  - Display ID column with `search: false` and `width: 80`
  - Do not display: `created_at`, `deleted_at`, `updated_at`
- Use naming conventions:
  - Function names: PascalCase with suffix (e.g., `OptionsColumns`, `OptionsFields`)
  - Labels: convert snake_case to Title Case in Vietnamese
  - Placeholders: prefix "Nhập" for inputs or "Chọn" for selections

## Notes

- Use SQL table definition to:
  - Identify table name, columns, data types and constraints
  - Apply validation rules based on SQL constraints (`NOT NULL` → `required: true`)
  - Map SQL data types to appropriate Pro Form components
- Form fields should be wrapped in `<ProForm.Group>...</ProForm.Group>`
- ID field in form should have `hidden disabled` properties
- All VARCHAR fields use ProFormText component
- All TEXT fields use ProFormTextArea component with autoSize

## Example

### Input (SQL Definition)

```sql
DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  option_table VARCHAR(255) NOT NULL,
  option_column VARCHAR(255) NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  option_color VARCHAR(255) DEFAULT NULL,
  option_group VARCHAR(255) DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON options FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Output (options-schema.js)

```javascript
// path: @/component/custom/options/options-schema.js

import { ProForm, ProFormText } from "@ant-design/pro-form";

export function OptionsColumns() {
  return [
    {
      title: "ID",
      dataIndex: "id",
      valueType: "text",
      search: false,
      width: 80,
    },
    {
      title: "Bảng",
      dataIndex: "option_table",
      valueType: "text",
      sorter: { multiple: 1 },
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
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Nhóm",
      dataIndex: "option_group",
      valueType: "text",
      sorter: { multiple: 1 },
    },
  ];
}

export function OptionsFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="option_table"
        label="Bảng"
        placeholder="Nhập tên bảng"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_column"
        label="Cột"
        placeholder="Nhập tên cột"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_label"
        label="Nhãn"
        placeholder="Nhập nhãn"
        rules={[{ required: true }]}
      />
      <ProFormText
        name="option_color"
        label="Màu sắc"
        placeholder="Nhập mã màu"
      />
      <ProFormText
        name="option_group"
        label="Nhóm"
        placeholder="Nhập tên nhóm"
      />
    </ProForm.Group>
  );
}
```
