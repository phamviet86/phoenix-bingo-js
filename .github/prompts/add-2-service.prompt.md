---
mode: "edit"
description: "Tạo file service layer JavaScript hoàn chỉnh với các thao tác CRUD dựa trên định nghĩa bảng SQL, bao gồm pagination, filtering và soft delete."
---

## Yêu cầu

- Tạo file service từ định nghĩa bảng SQL:
  - `{table-name}-service.js` trong thư mục `/src/service/`
  - Export năm functions: `get{TableName}s`, `get{TableName}`, `create{TableName}`, `update{TableName}`, `delete{TableName}`
- Bao gồm các thao tác CRUD hoàn chỉnh:
  - GET All: Lấy tất cả bản ghi với pagination, filtering và sorting
  - GET Single: Lấy một bản ghi cụ thể theo ID
  - POST: Tạo một bản ghi mới
  - PUT: Cập nhật một bản ghi hiện có
  - DELETE: Xóa mềm một bản ghi (soft delete)
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Import statements từ database connection và query utilities
  - Error handling với try-catch blocks
  - Soft delete pattern với kiểm tra `deleted_at IS NULL`
  - SQL injection prevention sử dụng tagged template literals
  - Pagination và filtering sử dụng parseSearchParams
- Bao gồm cấu hình SQL phù hợp:
  - SELECT queries: loại trừ `created_at` và `deleted_at`, bao gồm `COUNT(*) OVER() AS total` cho getAll
  - INSERT/UPDATE queries: sử dụng `RETURNING` clause với các cột cụ thể
  - DELETE queries: sử dụng soft delete bằng cách set `deleted_at = NOW()`
  - ORDER BY mặc định: `ORDER BY created_at` khi không có orderByClause
- Sử dụng các quy ước đặt tên:
  - File names: kebab-case (ví dụ: `options-service.js`)
  - Function names: camelCase với verb (ví dụ: `getOptions`, `createOption`)
  - PascalCase cho tên bảng trong function names, số nhiều cho getAll, số ít cho các functions khác
- Triển khai pattern kết nối database:
  - Tagged template literals cho single operations
  - `sql.query(sqlText, sqlValue)` cho complex queries với dynamic parameters

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Trích xuất tên bảng và tất cả định nghĩa cột
  - Loại trừ các cột tự động quản lý (`id`, `created_at`, `updated_at`, `deleted_at`) khỏi create/update operations
  - Xác định các cột nghiệp vụ cần thiết cho SELECT statements
- Pattern sử dụng parseSearchParams:
  - Khai báo `const ignoredSearchColumns = [];` cho các cột bị bỏ qua trong search
  - Destructure kết quả: `{ whereClause, orderByClause, limitClause, queryValues }`
  - Sao chép queryValues: `const sqlValue = [...queryValues];`
- SQL Connection patterns:
  - Khởi tạo: `const sql = getConnection();`
  - Get All: `sql.query(sqlText, sqlValue)` với string template và array values
  - Các functions khác: tagged template literals `sql\`query\`` với embedded variables
- Error handling:
  - Wrap tất cả functions trong try-catch blocks
  - Throw new Error(error.message) khi có lỗi
- Thứ tự và formatting:
  - Duy trì thứ tự tham số nhất quán trong SQL queries
  - Sử dụng line breaks và indentation cho SQL queries dễ đọc
  - Luôn kết thúc SQL statements với dấu chấm phẩy

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

### Đầu ra (options-service.js)

```javascript
// path: @/service/options-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getOptions(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, updated_at, option_table, option_column, option_label, option_color, option_group,
        COUNT(*) OVER() AS total
      FROM options
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    const sql = getConnection();
    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getOption(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, updated_at, option_table, option_column, option_label, option_color, option_group
      FROM options
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createOption(data) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    const sql = getConnection();
    return await sql`
      INSERT INTO options (
        option_table, option_column, option_label, option_color, option_group
      ) VALUES (
        ${option_table}, ${option_column}, ${option_label}, ${option_color}, ${option_group}
      )
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateOption(data, id) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    const sql = getConnection();
    return await sql`
      UPDATE options
      SET option_table = ${option_table}, option_column = ${option_column}, option_label = ${option_label}, option_color = ${option_color}, option_group = ${option_group}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteOption(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE options
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
```
