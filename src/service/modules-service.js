// path: @/service/modules-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getModules(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT m.id, m.course_id, m.module_name, m.module_desc,
        c.course_name, c.course_status_id,
        COUNT(*) OVER() AS total
      FROM modules m
      JOIN courses c ON c.id = m.course_id AND c.deleted_at IS NULL
      WHERE m.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY course_name, module_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getModule(id) {
  try {
    return await sql`
    SELECT m.id, m.course_id, m.module_name, m.module_desc,
      c.course_name, c.course_status_id
    FROM modules m
    JOIN courses c ON c.id = m.course_id AND c.deleted_at IS NULL
    WHERE m.deleted_at IS NULL AND m.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createModule(data) {
  try {
    const { course_id, module_name, module_desc } = data;

    return await sql`
      INSERT INTO modules (
        course_id, module_name, module_desc
      ) VALUES (
        ${course_id}, ${module_name}, ${module_desc}
      )
      RETURNING id, course_id, module_name, module_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateModule(data, id) {
  try {
    const { course_id, module_name, module_desc } = data;

    return await sql`
      UPDATE modules
      SET course_id = ${course_id}, module_name = ${module_name}, module_desc = ${module_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, course_id, module_name, module_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteModule(id) {
  try {
    return await sql`
      UPDATE modules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, course_id, module_name, module_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get all modules not assigned to a class
export async function getModulesNotInClass(searchParams, classId) {
  try {
    const ignoredSearchColumns = ["class_id"];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [classId, ...queryValues];
    const sqlText = `
      SELECT m.id, m.course_id, m.module_name, m.module_desc,
        c.course_name, c.course_status_id,
        COUNT(*) OVER() AS total
      FROM modules m
      JOIN courses c ON c.id = m.course_id AND c.deleted_at IS NULL
      WHERE m.deleted_at IS NULL
      AND NOT EXISTS (
        SELECT 1 FROM sections s
        WHERE s.module_id = m.id AND s.deleted_at IS NULL AND s.class_id = $1
      )
      ${whereClause}
      ${orderByClause || "ORDER BY course_name, module_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}
