import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getModules(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, course_id, module_name, module_desc,
        COUNT(*) OVER() AS total
      FROM modules
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY module_name"}
      ${limitClause};
    `;

    const sql = getConnection();
    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getModule(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, course_id, module_name, module_desc
      FROM modules
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createModule(data) {
  try {
    const { course_id, module_name, module_desc } = data;

    const sql = getConnection();
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

    const sql = getConnection();
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
    const sql = getConnection();
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
