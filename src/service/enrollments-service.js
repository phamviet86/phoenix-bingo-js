// path: @/service/enrollments-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getEnrollments(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT e.id, e.user_id, e.module_id, e.section_id, e.enrollment_type_id, 
        e.enrollment_payment_type_id, e.enrollment_payment_amount, e.enrollment_payment_discount,
        e.enrollment_start_date, e.enrollment_end_date, e.enrollment_status,
        cl.class_name, cl.class_code,
        u.user_name,
        m.module_name,
        c.course_name,
        COUNT(*) OVER() AS total
      FROM enrollments_view e
      LEFT JOIN users u ON e.user_id = u.id AND u.deleted_at IS NULL
      LEFT JOIN modules m ON e.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN courses c ON m.course_id = c.id AND c.deleted_at IS NULL
      LEFT JOIN sections s ON e.section_id = s.id AND s.deleted_at IS NULL
      LEFT JOIN classes cl ON s.class_id = cl.id AND cl.deleted_at IS NULL
      WHERE e.deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY e.created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getEnrollment(id) {
  try {
    return await sql`
      SELECT e.id, e.user_id, e.module_id, e.section_id, e.enrollment_type_id, 
        e.enrollment_payment_type_id, e.enrollment_payment_amount, e.enrollment_payment_discount,
        e.enrollment_start_date, e.enrollment_end_date, e.enrollment_status,
        cl.class_name, cl.class_code,
        u.user_name,
        m.module_name,
        c.course_name
      FROM enrollments_view e
      LEFT JOIN users u ON e.user_id = u.id AND u.deleted_at IS NULL
      LEFT JOIN modules m ON e.module_id = m.id AND m.deleted_at IS NULL
      LEFT JOIN courses c ON m.course_id = c.id AND c.deleted_at IS NULL
      LEFT JOIN sections s ON e.section_id = s.id AND s.deleted_at IS NULL
      LEFT JOIN classes cl ON s.class_id = cl.id AND cl.deleted_at IS NULL
      WHERE e.deleted_at IS NULL AND e.id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createEnrollment(data) {
  try {
    const {
      user_id,
      module_id,
      section_id,
      enrollment_type_id,
      enrollment_payment_type_id,
      enrollment_payment_amount,
      enrollment_payment_discount,
      enrollment_start_date,
      enrollment_end_date,
    } = data;

    return await sql`
      INSERT INTO enrollments (
        user_id, module_id, section_id, enrollment_type_id, 
        enrollment_payment_type_id, enrollment_payment_amount, enrollment_payment_discount,
        enrollment_start_date, enrollment_end_date
      ) VALUES (
        ${user_id}, ${module_id}, ${section_id}, ${enrollment_type_id}, 
        ${enrollment_payment_type_id}, ${enrollment_payment_amount}, ${enrollment_payment_discount},
        ${enrollment_start_date}, ${enrollment_end_date}
      )
      RETURNING id, user_id, module_id, section_id, enrollment_type_id, 
        enrollment_payment_type_id, enrollment_payment_amount, enrollment_payment_discount,
        enrollment_start_date, enrollment_end_date;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateEnrollment(data, id) {
  try {
    const {
      user_id,
      module_id,
      section_id,
      enrollment_type_id,
      enrollment_payment_type_id,
      enrollment_payment_amount,
      enrollment_payment_discount,
      enrollment_start_date,
      enrollment_end_date,
    } = data;

    return await sql`
      UPDATE enrollments
      SET user_id = ${user_id}, module_id = ${module_id}, section_id = ${section_id}, 
        enrollment_type_id = ${enrollment_type_id}, enrollment_payment_type_id = ${enrollment_payment_type_id}, 
        enrollment_payment_amount = ${enrollment_payment_amount}, enrollment_payment_discount = ${enrollment_payment_discount},
        enrollment_start_date = ${enrollment_start_date}, enrollment_end_date = ${enrollment_end_date}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, user_id, module_id, section_id, enrollment_type_id, 
        enrollment_payment_type_id, enrollment_payment_amount, enrollment_payment_discount,
        enrollment_start_date, enrollment_end_date;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteEnrollment(id) {
  try {
    return await sql`
      UPDATE enrollments
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, user_id, module_id, section_id, enrollment_type_id, 
        enrollment_payment_type_id, enrollment_payment_amount, enrollment_payment_discount,
        enrollment_start_date, enrollment_end_date;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
