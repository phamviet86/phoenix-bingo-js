---
mode: "edit"
description: "Tạo các file schema hoàn chỉnh cho Ant Design Pro component system từ định nghĩa bảng SQL, bao gồm cấu hình cột bảng và form fields."
---

## Yêu cầu

- Tạo file schema từ định nghĩa bảng SQL:
  - `{tableName}-schema.js` trong thư mục `/src/component/custom/{tableName}/`
  - Export hai functions: `[TableName]Columns` và `[TableName]Fields`
- Bao gồm các component mapping dựa trên kiểu dữ liệu SQL:
  - VARCHAR/TEXT → ProFormText/ProFormTextArea với prop `fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}`
  - INT/SERIAL → ProFormText (không phải ProFormDigit)
  - TIMESTAMPTZ/TIME → ProFormDatePicker/ProFormTimePicker
  - Fields NOT NULL → `rules={[{ required: true }]}`
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Cấu hình cột bảng với valueType phù hợp
  - Validation dựa trên ràng buộc SQL
  - Import statements từ Ant Design Pro
- Bao gồm cấu hình cột bảng phù hợp:
  - TEXT fields: `valueType: textarea`
  - VARCHAR fields: `valueType: text`
  - ID column: `search: false`, `width: 80`
  - All non-ID columns: `sorter: { multiple: 1 }`
- Ẩn các system fields:
  - Hiển thị ID column với `search: false` và `width: 80`
  - Không hiển thị: `created_at`, `deleted_at`, `updated_at`
- Sử dụng các quy ước đặt tên:
  - Function names: PascalCase với suffix (ví dụ: `OptionsColumns`, `OptionsFields`)
  - Labels: chuyển đổi snake_case thành Title Case bằng tiếng Việt
  - Placeholders: tiền tố "Nhập" cho inputs hoặc "Chọn" cho selections

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Xác định tên bảng, cột, kiểu dữ liệu và ràng buộc
  - Áp dụng validation rules dựa trên ràng buộc SQL (`NOT NULL` → `required: true`)
  - Map kiểu dữ liệu SQL sang Pro Form components phù hợp
- Các form fields nên được wrap trong `<ProForm.Group>...</ProForm.Group>`
- ID field trong form nên có `hidden disabled` properties
- Tất cả VARCHAR fields sử dụng ProFormText component
- Tất cả TEXT fields sử dụng ProFormTextArea component với autoSize

## Ví dụ

### Đầu vào (Định nghĩa SQL)

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

### Đầu ra (options-schema.js)

```javascript
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
