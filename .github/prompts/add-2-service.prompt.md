---
mode: "edit"
description: "Tạo file service layer JavaScript hoàn chỉnh với các thao tác CRUD dựa trên câu lệnh SQL CREATE TABLE."
---

## Yêu cầu

### Cấu trúc file và import

- Phân tích câu lệnh SQL CREATE TABLE để trích xuất tên bảng và tất cả định nghĩa cột.
- Tạo file service với pattern đặt tên kebab-case: `{table-name}-service.js`, trong thư mục [service](../../src/service)
- Import `getConnection` từ `@/lib/db/neon` cho các thao tác database.
- Import `parseSearchParams` từ `@/lib/util/query-util` cho việc phân tích query.
- Thêm comment path ở đầu file: `// path: @/service/{table-name}-service.js`.

### Định nghĩa hàm

- Tạo năm hàm chính sử dụng camelCase: `get{TableName}s`, `get{TableName}`, `create{TableName}`, `update{TableName}`, `delete{TableName}`.
- Sử dụng PascalCase cho tên bảng trong tên hàm, nhưng giữ nguyên form số ít cho tất cả trừ hàm getAll (ví dụ: `getOptions` số nhiều cho getAll, `getOption` số ít cho getById).
- Sử dụng destructuring assignment cho tham số data trong hàm create và update.
- Wrap tất cả hàm trong try-catch blocks và throw new Error(error.message) khi có lỗi.

### SQL Query patterns

- Sử dụng tagged template literals với `sql` connection thay vì parameterized queries để ngăn chặn SQL injection.
- Triển khai pattern soft delete bằng cách kiểm tra `deleted_at IS NULL` trong tất cả query SELECT.
- Trong SELECT queries, chỉ định tên cột cụ thể, bao gồm `id`, `updated_at` và các cột nghiệp vụ, loại trừ `created_at` và `deleted_at`.
- Bao gồm `COUNT(*) OVER() AS total` trong query get all cho metadata pagination.
- Sử dụng mệnh đề `RETURNING` với tên cột cụ thể trong các thao tác INSERT, UPDATE và DELETE.
- Thêm mệnh đề ORDER BY mặc định sử dụng `ORDER BY created_at` khi không có orderByClause từ parseSearchParams.

### Thao tác CRUD

- Loại trừ các cột tự động quản lý (`id`, `created_at`, `updated_at`, `deleted_at`) khỏi thao tác create và update.
- Triển khai soft delete bằng cách set `deleted_at = NOW()` thay vì hard deletion.
- Thêm hỗ trợ filtering, sorting và pagination trong hàm get all sử dụng `parseSearchParams`.
- Trả về kết quả trực tiếp từ các lời gọi database query.

### Pattern sử dụng parseSearchParams

- Khai báo `const ignoredSearchColumns = [];` để định nghĩa các cột bị bỏ qua trong search.
- Gọi `parseSearchParams(searchParams, ignoredSearchColumns)`.
- Destructure kết quả: `{ whereClause, orderByClause, limitClause, queryValues }`.
- Sao chép queryValues vào sqlValue: `const sqlValue = [...queryValues];`.
- Sử dụng `sql.query(sqlText, sqlValue)` cho getAll function với string interpolation.

### Patterns cho SQL Connection

- Khởi tạo connection: `const sql = getConnection();`
- Cho hàm getAll: Sử dụng `sql.query(sqlText, sqlValue)` với string template và array values.
- Cho các hàm khác: Sử dụng tagged template literals `sql\`query\`` với embedded variables.

## Đặc tả hàm

- **Get All**: Nhận `searchParams`, sử dụng `parseSearchParams`, bao gồm pagination và filtering, sử dụng `sql.query()`.
- **Get Single**: Nhận `id`, trả về một record hoặc null nếu không tìm thấy, sử dụng tagged template.
- **Create**: Nhận object `data`, destructure các cột bảng liên quan, insert record mới, sử dụng tagged template.
- **Update**: Nhận `data` và `id`, update record hiện có theo id, sử dụng tagged template.
- **Delete**: Nhận `id`, thực hiện thao tác soft delete, sử dụng tagged template.

## Pattern SQL Query

- **Select All** (sử dụng sql.query):
  ```javascript
  const sqlText = `
    SELECT id, updated_at, column1, column2, ...,
      COUNT(*) OVER() AS total
    FROM {table}
    WHERE deleted_at IS NULL
    ${whereClause}
    ${orderByClause || "ORDER BY created_at"}
    ${limitClause};
  `;
  return await sql.query(sqlText, sqlValue);
  ```

- **Select One** (sử dụng tagged template):
  ```javascript
  return await sql`
    SELECT id, updated_at, column1, column2, ...
    FROM {table}
    WHERE deleted_at IS NULL AND id = ${id};
  `;
  ```

- **Insert** (sử dụng tagged template):
  ```javascript
  return await sql`
    INSERT INTO {table} (
      column1, column2, ...
    ) VALUES (
      ${column1}, ${column2}, ...
    )
    RETURNING id, updated_at, column1, column2, ...;
  `;
  ```

- **Update** (sử dụng tagged template):
  ```javascript
  return await sql`
    UPDATE {table}
    SET column1 = ${column1}, column2 = ${column2}, ...
    WHERE deleted_at IS NULL AND id = ${id}
    RETURNING id, updated_at, column1, column2, ...;
  `;
  ```

- **Delete** (sử dụng tagged template):
  ```javascript
  return await sql`
    UPDATE {table}
    SET deleted_at = NOW()
    WHERE deleted_at IS NULL AND id = ${id}
    RETURNING id, updated_at, column1, column2, ...;
  `;
  ```

## Ghi chú

- Duy trì thứ tự tham số nhất quán trong SQL queries để dễ đọc.
- Sử dụng line breaks và indentation để làm cho SQL queries dễ đọc.
- Luôn kết thúc SQL statements với dấu chấm phẩy.
- Sử dụng tagged template literals cho single operations và sql.query() cho complex queries với dynamic parameters.

## Ví dụ cụ thể

### Input - SQL Schema:

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

### Output - Service File:

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
