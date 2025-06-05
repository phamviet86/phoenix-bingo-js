// path: @/service/roles-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getRoles(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, role_name, role_path, role_color,
        COUNT(*) OVER() AS total
      FROM roles
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY role_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getRole(id) {
  try {
    return await sql`
      SELECT id, role_name, role_path, role_color
      FROM roles
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRole(data) {
  try {
    const { role_name, role_path, role_color } = data;

    return await sql`
      INSERT INTO roles (
        role_name, role_path, role_color
      ) VALUES (
        ${role_name}, ${role_path}, ${role_color}
      )
      RETURNING id, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateRole(data, id) {
  try {
    const { role_name, role_path, role_color } = data;

    return await sql`
      UPDATE roles
      SET role_name = ${role_name}, role_path = ${role_path}, role_color = ${role_color}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteRole(id) {
  try {
    return await sql`
      UPDATE roles
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

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
