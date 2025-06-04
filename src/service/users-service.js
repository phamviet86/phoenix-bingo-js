import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

export async function getUsers(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes,
        COUNT(*) OVER() AS total
      FROM users
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

export async function getUser(id) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, user_name, user_status_id, user_email, user_phone, user_parent_phone, user_avatar, user_desc, user_notes
      FROM users
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

    const sql = getConnection();
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

    const sql = getConnection();
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
    const sql = getConnection();
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
  const queryValues = [email];
  const queryText = `
    SELECT * 
    FROM users 
    WHERE deleted_at IS NULL AND user_email = $1;
  `;

  return await executeQuery(queryText, queryValues);
}

export async function getUserByEmail(email) {
  try {
    const sql = getConnection();
    return await sql`
      SELECT id, user_name, user_status_id, user_email, user_password, user_phone, user_parent_phone, user_avatar, user_desc, user_notes
      FROM users
      WHERE deleted_at IS NULL AND user_email = ${email};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
