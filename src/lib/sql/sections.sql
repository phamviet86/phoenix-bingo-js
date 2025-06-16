DROP VIEW IF EXISTS sections_view CASCADE;
DROP TABLE IF EXISTS sections CASCADE;

CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  class_id UUID NOT NULL,
  module_id UUID NOT NULL,
  section_start_date TIMESTAMPTZ DEFAULT NULL,
  section_end_date TIMESTAMPTZ DEFAULT NULL,
  section_fee INTEGER DEFAULT 0,
  section_total_fee INTEGER DEFAULT 0
);

CREATE TRIGGER update_record
BEFORE UPDATE ON sections
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP VIEW IF EXISTS sections_view CASCADE;
CREATE OR REPLACE VIEW sections_view AS
SELECT
  s.*,
  CASE
    WHEN s.section_start_date IS NULL AND s.section_end_date IS NULL THEN 'Chưa có lịch'
    WHEN s.section_start_date > s.section_end_date AND s.section_end_date IS NOT NULL THEN 'Nhập sai ngày'
    WHEN s.section_start_date IS NOT NULL AND NOW() < s.section_start_date THEN 'Chờ'
    WHEN s.section_start_date IS NOT NULL AND s.section_end_date IS NULL AND NOW() >= s.section_start_date THEN 'Đang học'
    WHEN s.section_start_date IS NOT NULL AND s.section_end_date IS NOT NULL AND NOW() >= s.section_start_date AND NOW() < s.section_end_date THEN 'Đang học'
    WHEN s.section_end_date IS NOT NULL AND NOW() >= s.section_end_date THEN 'Đã học xong'
    ELSE 'Chưa có lịch'
  END AS section_status,
  COALESCE(sc.pending_count, 0) as pending_count,
  COALESCE(sc.completed_count, 0) as completed_count,
  COALESCE(sc.absent_count, 0) as absent_count
FROM sections s
LEFT JOIN (
  SELECT
    section_id,
    COUNT(CASE WHEN schedule_status_id = 13 THEN 1 END) as pending_count,
    COUNT(CASE WHEN schedule_status_id = 14 THEN 1 END) as completed_count,
    COUNT(CASE WHEN schedule_status_id = 15 THEN 1 END) as absent_count
  FROM schedules
  WHERE deleted_at IS NULL
  GROUP BY section_id
) sc ON s.id = sc.section_id;