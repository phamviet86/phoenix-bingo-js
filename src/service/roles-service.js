import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getRoles(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, updated_at, role_name, role_path, role_color,
        COUNT(*) OVER() AS total
      FROM roles
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

export async function getRole(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, updated_at, role_name, role_path, role_color
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

    const sql = getConnection();
    return await sql`
      INSERT INTO roles (
        role_name, role_path, role_color
      ) VALUES (
        ${role_name}, ${role_path}, ${role_color}
      )
      RETURNING id, updated_at, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateRole(data, id) {
  try {
    const { role_name, role_path, role_color } = data;

    const sql = getConnection();
    return await sql`
      UPDATE roles
      SET role_name = ${role_name}, role_path = ${role_path}, role_color = ${role_color}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteRole(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE roles
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, role_name, role_path, role_color;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
