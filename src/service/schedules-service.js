import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getSchedules(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT 
        s.id, s.section_id, s.lesson_id, s.shift_id, s.room_id, s.schedule_date, s.schedule_status_id, s.schedule_desc,
        sh.shift_start_time, sh.shift_end_time, sh.shift_name,
        o.option_color AS schedule_status_color,
        c.class_name, c.class_code, 
        r.room_name,
        m.module_name, 
        l.lesson_name,
        COUNT(*) OVER() AS total
      FROM schedules s
      JOIN options o ON s.schedule_status_id = o.id AND o.deleted_at IS NULL 
      JOIN shifts sh ON s.shift_id = sh.id AND sh.deleted_at IS NULL
      JOIN sections st ON s.section_id = st.id AND st.deleted_at IS NULL
      JOIN classes c ON st.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON st.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN lessons l ON s.lesson_id = l.id AND l.deleted_at IS NULL
      LEFT JOIN rooms r ON s.room_id = r.id AND r.deleted_at IS NULL
      WHERE s.deleted_at IS NULL
      ${whereClause}
      ${
        orderByClause ||
        "ORDER BY schedule_date, shift_start_time, shift_end_time"
      }
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSchedule(id) {
  try {
    return await sql`
      SELECT 
        s.id, s.section_id, s.lesson_id, s.shift_id, s.room_id, s.schedule_date, s.schedule_status_id, s.schedule_desc,
        sh.shift_start_time, sh.shift_end_time, sh.shift_name,
        o.option_color AS schedule_status_color,
        c.class_name, c.class_code, 
        r.room_name,
        m.module_name, 
        l.lesson_name
      FROM schedules s
      JOIN options o ON s.schedule_status_id = o.id AND o.deleted_at IS NULL 
      JOIN shifts sh ON s.shift_id = sh.id AND sh.deleted_at IS NULL
      JOIN sections st ON s.section_id = st.id AND st.deleted_at IS NULL
      JOIN classes c ON st.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON st.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN lessons l ON s.lesson_id = l.id AND l.deleted_at IS NULL
      LEFT JOIN rooms r ON s.room_id = r.id AND r.deleted_at IS NULL
      WHERE s.deleted_at IS NULL AND s.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createSchedule(data) {
  try {
    const {
      section_id,
      lesson_id,
      shift_id,
      room_id,
      schedule_date,
      schedule_status_id,
      schedule_desc,
    } = data;

    return await sql`
      INSERT INTO schedules (
        section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc
      ) VALUES (
        ${section_id}, ${lesson_id}, ${shift_id}, ${room_id}, ${schedule_date}, ${schedule_status_id}, ${schedule_desc}
      )
      RETURNING id, section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateSchedule(data, id) {
  try {
    const {
      section_id,
      lesson_id,
      shift_id,
      room_id,
      schedule_date,
      schedule_status_id,
      schedule_desc,
    } = data;

    return await sql`
      UPDATE schedules
      SET section_id = ${section_id}, lesson_id = ${lesson_id}, shift_id = ${shift_id}, room_id = ${room_id}, schedule_date = ${schedule_date}, schedule_status_id = ${schedule_status_id}, schedule_desc = ${schedule_desc}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteSchedule(id) {
  try {
    return await sql`
      UPDATE schedules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Duplicate multiple schedules by their IDs, incrementing schedule_date by 7 days
export async function duplicateSchedules(ids) {
  try {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

    const queryText = `
      INSERT INTO schedules (section_id, shift_id, schedule_date)
      SELECT section_id, shift_id, schedule_date + INTERVAL '7 days'
      FROM schedules
      WHERE id IN (${placeholders}) AND deleted_at IS NULL
      RETURNING id, section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc;
    `;
    const queryValues = ids;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Soft-delete multiple schedules by their IDs
export async function deleteSchedules(ids) {
  try {
    const placeholders = ids.map((_, index) => `$${index + 1}`).join(", ");

    const queryText = `
      UPDATE schedules
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL 
        AND id IN (${placeholders})
      RETURNING id, section_id, lesson_id, shift_id, room_id, schedule_date, schedule_status_id, schedule_desc;
    `;
    const queryValues = ids;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}
