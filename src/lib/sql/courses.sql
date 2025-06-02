DROP TABLE IF EXISTS courses CASCADE;
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  course_name VARCHAR(255) NOT NULL,
  course_status_id INTEGER NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION set_updated_at();