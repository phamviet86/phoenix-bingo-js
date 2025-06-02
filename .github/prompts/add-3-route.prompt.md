---
mode: "edit"
description: "Tạo các file API route hoàn chỉnh cho một service với các thao tác CRUD dựa trên định nghĩa bảng SQL và module service."
---

## Yêu cầu

- Tạo hai file API route:
  - `route.js` trong thư mục `/src/app/(back)/api/{tableName}` cho các thao tác liệt kê/tạo mới
  - `[id]/route.js` trong thư mục `/src/app/(back)/api/{tableName}/[id]` cho các thao tác chi tiết/cập nhật/xóa
- Bao gồm các route handler sau dựa trên HTTP methods:
  - GET: Lấy tất cả bản ghi (cho route.js) hoặc một bản ghi cụ thể (cho [id]/route.js)
  - POST: Tạo một bản ghi mới (chỉ trong route.js)
  - PUT: Cập nhật một bản ghi hiện có (chỉ trong [id]/route.js)
  - DELETE: Xóa mềm một bản ghi (chỉ trong [id]/route.js)
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Các câu lệnh import từ file service tương ứng
  - Xử lý lỗi với các khối try/catch
  - Validation các đầu vào bắt buộc dựa trên ràng buộc SQL NOT NULL
  - Định dạng response sử dụng các hàm helper
  - Trích xuất tham số từ request body và URL
- Bao gồm các response lỗi phù hợp với mã trạng thái thích hợp:
  - 400 cho các tham số bắt buộc bị thiếu
  - 404 cho các bản ghi không tìm thấy hoặc đã bị xóa
  - 500 cho lỗi server hoặc creation/update failed
- Sử dụng các mẫu đặt tên hàm service để:
  - Import và gọi các hàm service một cách chính xác
  - Khớp tên tham số giữa API và service calls
  - Cấu trúc dữ liệu response một cách thích hợp
- Cung cấp thông báo lỗi bằng tiếng Việt trong định dạng response

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Xác định các trường bắt buộc (ràng buộc NOT NULL trong SQL)
  - Đặt giá trị mặc định dạng hardcode cho các trường optional (thường là null)
  - Validate các kiểu trường dựa trên kiểu dữ liệu SQL
- Các hàm service được mong đợi có mẫu đặt tên sau:
  - getAll: `get{TableName}s` (số nhiều - ví dụ: getOptions)
  - getById: `get{TableName}` (số ít - ví dụ: getOption)
  - create: `create{TableName}` (số ít - ví dụ: createOption)
  - update: `update{TableName}` (số ít - ví dụ: updateOption)
  - delete: `delete{TableName}` (số ít - ví dụ: deleteOption)
- Các route handler nên trích xuất tham số từ:
  - Tham số query URL cho việc lọc trong các thao tác GET list
  - Request body cho các thao tác POST và PUT
  - Tham số đường dẫn URL cho các thao tác [id] sử dụng `await context.params`
- Pattern kiểm tra kết quả service:
  - Sử dụng `if (!result || !result.length)` để kiểm tra thành công/thất bại cho getById, create, update, delete
  - Sử dụng `handleData(result)` và kiểm tra `data, total` cho getAll operations
  - Trả về 404 cho các trường hợp không tìm thấy
  - Trả về 500 cho các trường hợp creation/update failed
- Các response thành công nên bao gồm:
  - Dữ liệu được trả về bởi service call
  - Thông báo thành công bằng tiếng Việt
  - Mã trạng thái HTTP thích hợp (200, 201)

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

### Đầu ra (route.js)

```javascript
import { getOptions, createOption } from "@/service/options-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getOptions(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách tùy chọn thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    const result = await createOption(data);

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```

### Đầu ra ([id]/route.js)

```javascript
import {
  getOption,
  updateOption,
  deleteOption,
} from "@/service/options-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await getOption(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy tùy chọn.");

    return buildApiResponse(200, true, "Lấy thông tin tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const {
      option_table,
      option_column,
      option_label,
      option_color = null,
      option_group = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!option_table || !option_column || !option_label)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    };

    const result = await updateOption(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID tùy chọn.");

    const result = await deleteOption(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy tùy chọn hoặc tùy chọn đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa tùy chọn thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```
