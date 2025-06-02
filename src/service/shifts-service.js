// path: @/service/shifts-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getShifts(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, shift_name, shift_start_time, shift_end_time,
        COUNT(*) OVER() AS total
      FROM shifts
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY shift_start_time, shift_end_time"}
      ${limitClause};
    `;

    const sql = getConnection();
    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getShift(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, shift_name, shift_start_time, shift_end_time
      FROM shifts
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createShift(data) {
  try {
    const { shift_name, shift_start_time, shift_end_time } = data;

    const sql = getConnection();
    return await sql`
      INSERT INTO shifts (
        shift_name, shift_start_time, shift_end_time
      ) VALUES (
        ${shift_name}, ${shift_start_time}, ${shift_end_time}
      )
      RETURNING id, shift_name, shift_start_time, shift_end_time;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateShift(data, id) {
  try {
    const { shift_name, shift_start_time, shift_end_time } = data;

    const sql = getConnection();
    return await sql`
      UPDATE shifts
      SET shift_name = ${shift_name}, shift_start_time = ${shift_start_time}, shift_end_time = ${shift_end_time}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, shift_name, shift_start_time, shift_end_time;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteShift(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE shifts
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, shift_name, shift_start_time, shift_end_time;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
