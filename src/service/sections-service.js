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
      SELECT id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee,
        c.class_name, c.class_code,
        m.module_name,
        co.course_name, co.course_status_id,
        CONCAT(c.class_name, ' - ', m.module_name) AS section_name,
        COUNT(*) OVER() AS total
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      JOIN courses co ON m.course_id = co.id AND co.deleted_at IS NULL
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
      SELECT id, class_id, module_id, section_start_date, section_end_date, section_fee, section_total_fee,
        c.class_name, c.class_code,
        m.module_name,
        co.course_name, co.course_status_id,
        CONCAT(c.class_name, ' - ', m.module_name) AS section_name
      FROM sections_view s
      JOIN classes c ON s.class_id = c.id AND c.deleted_at IS NULL
      JOIN modules m ON s.module_id = m.id AND m.deleted_at IS NULL
      JOIN courses co ON m.course_id = co.id AND co.deleted_at IS NULL
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
