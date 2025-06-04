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
      SELECT l.id, l.module_id, l.lesson_name, l.lesson_no, l.lesson_desc,
        c.course_name,
        m.module_name,
        COUNT(*) OVER() AS total
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN courses c ON m.course_id = c.id AND c.deleted_at IS NULL
      WHERE l.deleted_at IS NULL
      ${whereClause}
      ${
        orderByClause ||
        "ORDER BY course_name, module_name, lesson_no, lesson_name"
      }
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
      SELECT l.id, l.module_id, l.lesson_name, l.lesson_no, l.lesson_desc,
        c.course_name,
        m.module_name
      FROM lessons l
      LEFT JOIN modules m ON l.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN courses c ON m.course_id = c.id AND c.deleted_at IS NULL
      WHERE l.deleted_at IS NULL AND l.id = ${id};
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
