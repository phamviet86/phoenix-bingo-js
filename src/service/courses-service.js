// path: @/service/courses-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getCourses(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, course_name, course_status_id,
        COUNT(*) OVER() AS total
      FROM courses
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY course_name"}
      ${limitClause};
    `;

    const sql = getConnection();
    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCourse(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, course_name, course_status_id
      FROM courses
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createCourse(data) {
  try {
    const { course_name, course_status_id } = data;

    const sql = getConnection();
    return await sql`
      INSERT INTO courses (
        course_name, course_status_id
      ) VALUES (
        ${course_name}, ${course_status_id}
      )
      RETURNING id, course_name, course_status_id;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateCourse(data, id) {
  try {
    const { course_name, course_status_id } = data;

    const sql = getConnection();
    return await sql`
      UPDATE courses
      SET course_name = ${course_name}, course_status_id = ${course_status_id}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, course_name, course_status_id;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteCourse(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE courses
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, course_name, course_status_id;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
