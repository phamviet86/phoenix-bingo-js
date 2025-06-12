DROP TABLE IF EXISTS schedules CASCADE;
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  section_id UUID NOT NULL,
  lesson_id UUID DEFAULT NULL,
  shift_id UUID NOT NULL,
  room_id UUID DEFAULT NULL,
  schedule_date TIMESTAMPTZ NOT NULL,
  schedule_status_id INTEGER NOT NULL,
  schedule_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION set_updated_at();