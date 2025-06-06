# Other code snippet

## Create or delete multiple user roles by user ID and role IDs

### service layer

```javascript
// path: @/service/user-roles-service.js
import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

// Create multiple user roles by user ID and role IDs
export async function createUserRolesByUser(userId, roleIds) {
  try {
    const queryValues = [];
    const valuePlaceholders = roleIds
      .map((roleId, index) => {
        queryValues.push(userId, roleId);
        return `($${index * 2 + 1}, $${index * 2 + 2})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO user_roles (user_id, role_id)
      VALUES ${valuePlaceholders}
      RETURNING id, user_id, role_id;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Soft-delete multiple user roles by user ID and role IDs
export async function deleteUserRolesByUser(userId, roleIds) {
  try {
    const placeholders = roleIds.map((_, index) => `$${index + 2}`).join(", ");

    const queryText = `
      UPDATE user_roles
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL 
        AND user_id = $1 
        AND role_id IN (${placeholders})
      RETURNING id, user_id, role_id;
    `;

    const queryValues = [userId, ...roleIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}
```

### api layer

```javascript
// path: app/api/users/[id]/user-roles/route.js

import {
  createUserRolesByUser,
  deleteUserRolesByUser,
} from "@/service/user-roles-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createUserRolesByUser(id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm quyền.");

    return buildApiResponse(201, true, "Thêm quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteUserRolesByUser(id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy phân quyền để xóa");

    return buildApiResponse(200, true, "Xóa phân quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```

## Get all roles not assigned to a user

### service layer

```javascript
// path: @/service/roles-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

// Get all roles not assisgned to a user
export async function getRolesNotInUser(searchParams, userId) {
  try {
    const ignoredSearchColumns = ["user_id"];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [userId, ...queryValues];
    const sqlText = `
      SELECT r.id, r.role_name, r.role_path, r.role_color,
        COUNT(*) OVER() AS total
      FROM roles r
      WHERE r.deleted_at IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.role_id = r.id AND ur.deleted_at IS NULL AND ur.user_id = $1
      )
      ${whereClause}
      ${orderByClause || "ORDER BY role_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}
```

### api layer

```javascript
// path: app/api/users/[id]/unassigned-roles/route.js

import { getRolesNotInUser } from "@/service/roles-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { searchParams } = new URL(request.url);

    const result = await getRolesNotInUser(searchParams, id);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách vai trò thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
```
