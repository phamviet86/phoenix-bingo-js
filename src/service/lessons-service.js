// path: @/service/lessons-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getLessons(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, module_id, lesson_name, lesson_no, lesson_desc,
        COUNT(*) OVER() AS total
      FROM lessons
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

export async function getLesson(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, module_id, lesson_name, lesson_no, lesson_desc
      FROM lessons
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createLesson(data) {
  try {
    const { module_id, lesson_name, lesson_no, lesson_desc } = data;

    const sql = getConnection();
    return await sql`
      INSERT INTO lessons (
        module_id, lesson_name, lesson_no, lesson_desc
      ) VALUES (
        ${module_id}, ${lesson_name}, ${lesson_no}, ${lesson_desc}
      )
      RETURNING id, module_id, lesson_name, lesson_no, lesson_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateLesson(data, id) {
  try {
    const { module_id, lesson_name, lesson_no, lesson_desc } = data;

    const sql = getConnection();
    return await sql`
      UPDATE lessons
      SET module_id = ${module_id}, lesson_name = ${lesson_name}, lesson_no = ${lesson_no}, lesson_desc = ${lesson_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, module_id, lesson_name, lesson_no, lesson_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteLesson(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE lessons
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, module_id, lesson_name, lesson_no, lesson_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
