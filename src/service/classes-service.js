// path: @/service/classes-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getClasses(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, class_name, class_code,
        COUNT(*) OVER() AS total
      FROM classes
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getClass(id) {
  try {
    return await sql`
      SELECT id, class_name, class_code
      FROM classes
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createClass(data) {
  try {
    const { class_name, class_code } = data;

    return await sql`
      INSERT INTO classes (
        class_name, class_code
      ) VALUES (
        ${class_name}, ${class_code}
      )
      RETURNING id, class_name, class_code;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateClass(data, id) {
  try {
    const { class_name, class_code } = data;

    return await sql`
      UPDATE classes
      SET class_name = ${class_name}, class_code = ${class_code}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, class_name, class_code;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteClass(id) {
  try {
    return await sql`
      UPDATE classes
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, class_name, class_code;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
