---
mode: "edit"
description: "Create complete API route files for a service with CRUD operations based on SQL table definition and service module."
---

## Requirements

- Create two API route files:
  - `route.js` in `/src/app/(back)/api/{tableName}` directory for list/create operations
  - `[id]/route.js` in `/src/app/(back)/api/{tableName}/[id]` directory for detail/update/delete operations
- Include the following route handlers based on HTTP methods:
  - GET: Retrieve all records (for route.js) or a specific record (for [id]/route.js)
  - POST: Create a new record or update if id exists (upsert) - only in route.js
  - PUT: Update an existing record (only in [id]/route.js)
  - DELETE: Soft delete a record (only in [id]/route.js)
- Follow established project patterns for:
  - Import statements from corresponding service file
  - Error handling with try/catch blocks
  - Input validation for required fields based on SQL NOT NULL constraints
  - Response formatting using helper functions
  - Parameter extraction from request body and URL
- Include appropriate error responses with proper status codes:
  - 400 for missing required parameters
  - 404 for records not found or already deleted
  - 500 for server errors or creation/update failures
- Use service function naming patterns to:
  - Import and call service functions correctly
  - Match parameter names between API and service calls
  - Structure response data appropriately
- Provide error messages in English in response format

## Naming Conventions

- Use camelCase for variable names (e.g., userId, totalPrice)
- Use camelCase for function names, starting with a verb (e.g., getUser, setProfile)
- **Use snake_case for data object keys that map to database columns** (e.g., { section_id, lesson_id, schedule_date })

## Notes

- Use SQL table definition to:
  - Identify required fields (NOT NULL constraints in SQL)
  - Set hardcoded default values for optional fields (usually null)
  - Validate field types based on SQL data types
- Service functions are expected to follow naming pattern:
  - getAll: `get{TableName}s` (plural - e.g., getOptions)
  - getById: `get{TableName}` (singular - e.g., getOption)
  - create: `create{TableName}` (singular - e.g., createOption)
  - update: `update{TableName}` (singular - e.g., updateOption)
  - delete: `delete{TableName}` (singular - e.g., deleteOption)
- Route handlers should extract parameters from:
  - URL query parameters for filtering in GET list operations
  - Request body for POST and PUT operations (including optional id field for upsert)
  - URL path parameters for [id] operations using `await context.params`
- Service result checking pattern:
  - Use `if (!result || !result.length)` to check success/failure for getById, create, update, delete
  - Use `handleData(result)` and check `data, total` for getAll operations
  - Return 404 for not found cases
  - Return 500 for creation/update failed cases
- POST handler logic:
  - Check if id exists in request body
  - If id exists: perform update and return status 200
  - If no id: perform create and return status 201
  - Use appropriate Vietnamese message for each case

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

### Output (route.js)

```javascript
import {
  getOptions,
  createOption,
  updateOption,
} from "@/service/options-service";
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
      id = null,
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

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing option
      result = await updateOption(data, id);
      message = "Cập nhật tùy chọn thành công.";
      statusCode = 200;
    } else {
      // Create new option
      result = await createOption(data);
      message = "Tạo tùy chọn thành công.";
      statusCode = 201;
    }

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(statusCode, true, message, {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```

### Output ([id]/route.js)

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
