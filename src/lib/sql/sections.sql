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

CREATE OR REPLACE VIEW sections_view AS
SELECT
  *,
  CASE
    WHEN section_start_date IS NULL AND section_end_date IS NULL THEN 'Chưa có lịch'
    WHEN section_start_date > section_end_date AND section_end_date IS NOT NULL THEN 'Nhập sai ngày'
    WHEN section_start_date IS NOT NULL AND NOW() < section_start_date THEN 'Chờ'
    WHEN section_start_date IS NOT NULL AND section_end_date IS NULL AND NOW() >= section_start_date THEN 'Đang học'
    WHEN section_start_date IS NOT NULL AND section_end_date IS NOT NULL AND NOW() >= section_start_date AND NOW() < section_end_date THEN 'Đang học'
    WHEN section_end_date IS NOT NULL AND NOW() >= section_end_date THEN 'Đã học xong'
    ELSE 'Chưa có lịch'
  END AS section_status_dynamic
FROM sections;