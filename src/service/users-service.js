// path: @/service/users-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getUsers(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes, user_first_name, user_full_name, role_names,
        COUNT(*) OVER() AS total
      FROM users_view
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY user_first_name, user_full_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUser(id) {
  try {
    return await sql`
      SELECT id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes, user_first_name, user_full_name, role_names
      FROM users_view
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createUser(data) {
  try {
    const {
      user_name,
      user_status_id,
      user_email,
      user_password,
      user_phone,
      user_parent_phone,
      user_avatar,
      user_desc,
      user_notes,
    } = data;

    return await sql`
      INSERT INTO users (
        user_name, user_status_id, user_email, user_password, user_phone, user_parent_phone, user_avatar, user_desc, user_notes
      ) VALUES (
        ${user_name}, ${user_status_id}, ${user_email}, ${user_password}, ${user_phone}, ${user_parent_phone}, ${user_avatar}, ${user_desc}, ${user_notes}
      )
      RETURNING id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUser(data, id) {
  try {
    const {
      user_name,
      user_status_id,
      user_email,
      user_phone,
      user_parent_phone,
      user_avatar,
      user_desc,
      user_notes,
    } = data;

    return await sql`
      UPDATE users
      SET user_name = ${user_name}, user_status_id = ${user_status_id}, user_email = ${user_email}, user_phone = ${user_phone}, user_parent_phone = ${user_parent_phone}, user_avatar = ${user_avatar}, user_desc = ${user_desc}, user_notes = ${user_notes}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteUser(id) {
  try {
    return await sql`
      UPDATE users
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get user by email
export async function getUserByEmail(email) {
  try {
    return await sql`
      SELECT id, user_name, user_status_id, user_email, user_password, user_phone, user_parent_phone, user_avatar, user_desc, user_notes
      FROM users
      WHERE deleted_at IS NULL AND user_email = ${email};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get user password
export async function getUserPassword(id) {
  try {
    return await sql`
      SELECT user_password
      FROM users
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Change user password
export async function changeUserPassword(id, newPassword) {
  try {
    return await sql`
      UPDATE users
      SET user_password = ${newPassword}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
