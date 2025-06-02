---
mode: "edit"
description: "Tạo các file schema hoàn chỉnh cho Ant Design Pro component system từ định nghĩa bảng SQL, bao gồm cấu hình cột bảng và form fields."
---

## Yêu cầu

- Tạo file schema từ định nghĩa bảng SQL:
  - `{tableName}-schema.js` trong thư mục `/src/component/{tableName}/`
  - Export hai functions: `[TableName]Columns` và `[TableName]Fields`
- Bao gồm các component mapping dựa trên kiểu dữ liệu SQL:
  - VARCHAR/TEXT → ProFormText/ProFormTextArea với prop `fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}`
  - INT/SERIAL → ProFormDigit
  - BOOLEAN → ProFormSwitch
  - TIMESTAMPTZ/TIME → ProFormDatePicker/ProFormTimePicker
  - Fields có suffix `_id` → ProFormSelect với options=[]
  - Fields NOT NULL → `rules={[{ required: true }]}`
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Cấu hình cột bảng với valueType phù hợp
  - Validation dựa trên ràng buộc SQL
  - Responsive design cho tất cả components
  - Import statements từ Ant Design Pro
- Bao gồm cấu hình cột bảng phù hợp:
  - TEXT fields: `valueType: textarea` với render helper
  - Enum-like fields (`_id` suffix): `valueType: select` với `valueEnum: {}`
  - Enum fields: `filters: true`
  - Non-hidden columns: `sorter: { multiple: 1 }`
  - Un-searchable columns: `search: false`
- Ẩn các system fields:
  - Không hiển thị: `id`, `created_at`, `deleted_at`
  - Hiển thị nhưng ẩn: `updated_at` với `hidden: true` và `search: false`
- Sử dụng các quy ước đặt tên:
  - Function names: PascalCase với suffix (ví dụ: `RoomColumns`, `RoomFields`)
  - Labels: chuyển đổi snake_case thành Title Case bằng tiếng Việt
  - Placeholders: tiền tố "Nhập" cho inputs hoặc "Chọn" cho selections

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Xác định tên bảng, cột, kiểu dữ liệu và ràng buộc
  - Áp dụng validation rules dựa trên ràng buộc SQL (`NOT NULL` → `required: true`)
  - Map kiểu dữ liệu SQL sang Pro Form components phù hợp
- Các form fields nên được wrap trong `<ProForm.Group>...</ProForm.Group>`
- Bao gồm render helpers cho TEXT fields sử dụng `renderTextArea` từ `@/lib/helpers/render-helper`
- Tất cả components nên implement responsive design
- Save schema file tới `/src/components/{tableName}/{tableName}-schema.js`

## Ví dụ

### Đầu vào (Định nghĩa SQL)

```sql
DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  room_name VARCHAR(255) NOT NULL,
  room_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON rooms FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Đầu ra (rooms-schema.js)

```javascript
import { ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-form";
import { renderTextArea } from "@/lib/helpers/render-helper";

export function RoomColumns() {
  return [
    {
      title: "Phòng học",
      dataIndex: "room_name",
      valueType: "text",
      sorter: { multiple: 1 },
    },
    {
      title: "Mô tả",
      dataIndex: "room_desc",
      valueType: "textarea",
      render: renderTextArea,
      search: false,
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      valueType: "dateTime",
      hidden: true,
      search: false,
    },
  ];
}

export function RoomFields() {
  return (
    <ProForm.Group>
      <ProFormText name="id" label="ID" hidden disabled />
      <ProFormText
        name="room_name"
        label="Phòng học"
        placeholder="Nhập tên phòng học"
        rules={[{ required: true }]}
      />
      <ProFormTextArea
        name="room_desc"
        label="Mô tả"
        placeholder="Nhập mô tả"
        fieldProps={{ autoSize: { minRows: 3, maxRows: 6 } }}
      />
    </ProForm.Group>
  );
}
```
