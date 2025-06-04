---
mode: "edit"
description: "Create a SQL file to define a new database table with specified columns and constraints."
---

## Requirements

- Create a new SQL file named `{tableName}.sql` in the [sql](../../src/lib/sql) directory
- Define the table with standard columns (`id`, `created_at`, `updated_at`, `deleted_at`) plus your custom columns
- Include appropriate constraints and default values for all columns
- Use UUID as primary key type with `gen_random_uuid()` as default value for `id`
- Add mandatory `set_updated_at()` trigger to automatically update timestamp for `updated_at`
- Follow snake_case naming convention for all column names
- Provide table name (e.g., `shifts`)
- Provide column definitions with data types and constraints (e.g., `shift_name varchar not null`)
- Use column definitions to:
  - Create table structure with appropriate data types
  - Add necessary constraints (PRIMARY KEY, NOT NULL)
  - Set default values when needed
  - Columns with names ending in `_id` should have INTEGER data type
  - Ensure compliance with snake_case naming convention

## Example

### Input

```
Table: options
Columns:
- shift_name varchar not null
- shift_status_id integer not null
- shift_start_time time nullable
- shift_end_time time nullable
- shift_desc text nullable
```

### Output

```sql
DROP TABLE IF EXISTS shifts CASCADE;
CREATE TABLE shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  shift_name VARCHAR(255) UNIQUE NOT NULL,
  shift_status_id INTEGER NOT NULL,
  shift_start_time TIME DEFAULT NULL,
  shift_end_time TIME DEFAULT NULL,
  shift_desc TEXT DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON shifts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```
