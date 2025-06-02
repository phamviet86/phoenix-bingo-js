---
mode: "edit"
description: "Tạo một file SQL để định nghĩa một bảng cơ sở dữ liệu mới với các cột và ràng buộc được chỉ định."
---

## Yêu cầu

- Tạo một file SQL mới có tên `{tableName}.sql` trong thư mục [sql](../../src/lib/sql)
- Định nghĩa bảng với các cột tiêu chuẩn (`id`, `created_at`, `updated_at`, `deleted_at`) cộng với các cột tùy chỉnh của bạn
- Bao gồm các ràng buộc và giá trị mặc định phù hợp cho tất cả các cột
- Sử dụng UUID làm kiểu khóa chính với `gen_random_uuid()` làm giá trị mặc định cho `id`
- Thêm trigger `set_updated_at()` bắt buộc để tự động cập nhật timestamp cho `updated_at`
- Tuân theo quy ước đặt tên snake_case cho tất cả tên cột
- Cung cấp tên bảng (ví dụ: `shifts`)
- Cung cấp định nghĩa cột với kiểu dữ liệu và ràng buộc (ví dụ: `shift_name varchar not null`)
- Sử dụng định nghĩa cột để:
  - Tạo cấu trúc bảng với kiểu dữ liệu phù hợp
  - Thêm các ràng buộc cần thiết (PRIMARY KEY, NOT NULL)
  - Đặt giá trị mặc định khi cần
  - Các cột có tên kết thúc bằng `_id` nên có kiểu dữ liệu INTEGER
  - Đảm bảo tuân thủ quy ước đặt tên snake_case

## Ví dụ

### Đầu vào

```
Table: options
Columns:
- shift_name varchar not null
- shift_status_id integer not null
- shift_start_time time nullable
- shift_end_time time nullable
- shift_desc text nullable
```

### Đầu ra

```sql
DROP TABLE IF EXISTS shifts CASCADE;
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  shift_name VARCHAR(255) UNIQUE NOT NULL,
  shift_status_id INTEGER NOT NULL,
  shift_start_time TIME DEFAULT NULL,
  shift_end_time TIME DEFAULT NULL,
  shift_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```
