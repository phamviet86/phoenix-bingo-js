// path: @/service/options-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getOptions(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, updated_at, option_table, option_column, option_label, option_color, option_group,
        COUNT(*) OVER() AS total
      FROM options
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

export async function getOption(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, updated_at, option_table, option_column, option_label, option_color, option_group
      FROM options
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createOption(data) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    const sql = getConnection();
    return await sql`
      INSERT INTO options (
        option_table, option_column, option_label, option_color, option_group
      ) VALUES (
        ${option_table}, ${option_column}, ${option_label}, ${option_color}, ${option_group}
      )
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateOption(data, id) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    const sql = getConnection();
    return await sql`
      UPDATE options
      SET option_table = ${option_table}, option_column = ${option_column}, option_label = ${option_label}, option_color = ${option_color}, option_group = ${option_group}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteOption(id) {
  try {
    const sql = getConnection();
    return await sql`
      UPDATE options
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, updated_at, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
