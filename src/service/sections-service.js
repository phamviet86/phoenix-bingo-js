import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getSections(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT s.id, s.class_id, s.module_id, s.section_start_date, s.section_end_date, s.section_fee, s.section_total_fee, s.section_status,
        c.class_name, c.class_code,
        m.module_name,
        co.course_name, co.course_status_id,
        ss.pending_count, ss.completed_count, ss.absent_count,
        COUNT(*) OVER() AS total
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      JOIN courses co ON m.course_id = co.id AND co.deleted_at IS NULL
      LEFT JOIN schedules_summary ss ON s.id = ss.section_id
      WHERE s.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY section_start_date, section_end_date"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSection(id) {
  try {
    return await sql`
      SELECT s.id, s.class_id, s.module_id, s.section_start_date, s.section_end_date, s.section_fee, s.section_total_fee, s.section_status, 
        c.class_name, c.class_code,
        m.module_name,
        co.course_name, co.course_status_id,
        ss.pending_count, ss.completed_count, ss.absent_count
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      JOIN courses co ON m.course_id = co.id AND co.deleted_at IS NULL
      LEFT JOIN schedules_summary ss ON s.id = ss.section_id
      WHERE s.deleted_at IS NULL AND s.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createSection(data) {
  try {
    const {
      class_id,
      module_id,
      section_start_date,
      section_end_date,
      section_fee,
      section_total_fee,
    } = data;

    return await sql`
      INSERT INTO sections (
        class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee
      ) VALUES (
        ${class_id}, ${module_id}, ${section_start_date}, ${section_end_date}, ${section_fee}, ${section_total_fee}
      )
      RETURNING id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateSection(data, id) {
  try {
    const {
      class_id,
      module_id,
      section_start_date,
      section_end_date,
      section_fee,
      section_total_fee,
    } = data;

    return await sql`
      UPDATE sections
      SET class_id = ${class_id}, module_id = ${module_id}, section_start_date = ${section_start_date}, section_end_date = ${section_end_date}, section_fee = ${section_fee}, section_total_fee = ${section_total_fee}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteSection(id) {
  try {
    return await sql`
      UPDATE sections
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Get all sections by class ID
export async function getSectionsByClass(searchParams, classId) {
  try {
    const ignoredSearchColumns = ["class_id"];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [classId, ...queryValues];
    const sqlText = `
      SELECT s.id, s.class_id, s.module_id, s.section_start_date, s.section_end_date, s.section_fee, s.section_total_fee, s.section_status, pending_count, completed_count, absent_count,
        c.class_name, c.class_code,
        m.module_name,
        co.course_name, co.course_status_id,
        COUNT(*) OVER() AS total
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      JOIN courses co ON m.course_id = co.id AND co.deleted_at IS NULL
      WHERE s.deleted_at IS NULL AND s.class_id = $1
      ${whereClause}
      ${orderByClause || "ORDER BY section_start_date, section_end_date"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Create multiple sections by class ID and module IDs
export async function createSectionsByClass(classId, moduleIds) {
  try {
    const queryValues = [];
    const valuePlaceholders = moduleIds
      .map((moduleId, index) => {
        queryValues.push(classId, moduleId);
        return `($${index * 2 + 1}, $${index * 2 + 2})`;
      })
      .join(", ");

    const queryText = `
      INSERT INTO sections (class_id, module_id)
      VALUES ${valuePlaceholders}
      RETURNING id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee;
    `;

    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Soft-delete multiple sections by class ID and module IDs
export async function deleteSectionsByClass(classId, moduleIds) {
  try {
    const placeholders = moduleIds
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const queryText = `
      UPDATE sections
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL 
        AND class_id = $1 
        AND module_id IN (${placeholders})
      RETURNING id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee;
    `;

    const queryValues = [classId, ...moduleIds];
    return await sql.query(queryText, queryValues);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getSectionSummary(searchParams, startDate, endDate) {
  try {
    const ignoredSearchColumns = ["start_date", "end_date"];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [startDate, endDate, ...queryValues];
    const sqlText = `
      SELECT 
        s.id, s.section_start_date, s.section_end_date, s.section_status,
        c.class_name, c.class_code, 
        m.module_name, 
        COUNT(sv.schedule_pending) AS pending_count,
        COUNT(sv.schedule_completed) AS completed_count,
        COUNT(sv.schedule_absent) AS absent_count,
        COUNT(*) OVER() AS total
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN schedules_view sv ON s.id = sv.section_id AND sv.deleted_at IS NULL AND sv.schedule_date >= $1 AND sv.schedule_date < $2
      WHERE s.deleted_at IS NULL 
      ${whereClause}
      GROUP BY s.id, s.section_start_date, s.section_end_date, s.section_status, c.class_name, c.class_code, m.module_name
      ${orderByClause || "ORDER BY class_name, module_name"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}
