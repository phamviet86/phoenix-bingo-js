DROP TABLE IF EXISTS classes CASCADE;
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  class_name VARCHAR(255) NOT NULL,
  class_code VARCHAR(255) NOT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION set_updated_at();