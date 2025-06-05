---
mode: "edit"
description: "Create a complete JavaScript service layer file with CRUD operations based on SQL table definition, including pagination, filtering and soft delete."
---

## Requirements

- Create service file from SQL table definition:
  - `{table-name}-service.js` in `/src/service/` directory
  - Export five functions: `get{TableName}s`, `get{TableName}`, `create{TableName}`, `update{TableName}`, `delete{TableName}`
- Include complete CRUD operations:
  - GET All: Retrieve all records with pagination, filtering and sorting
  - GET Single: Retrieve a specific record by ID
  - POST: Create a new record
  - PUT: Update an existing record
  - DELETE: Soft delete a record
- Follow established project patterns for:
  - Import statements from database connection and query utilities
  - Error handling with try-catch blocks
  - Soft delete pattern with `deleted_at IS NULL` checks
  - SQL injection prevention using tagged template literals
  - Pagination and filtering using parseSearchParams
- Include appropriate SQL configuration:
  - SELECT queries: exclude `created_at` and `deleted_at`, include `COUNT(*) OVER() AS total` for getAll
  - INSERT/UPDATE queries: use `RETURNING` clause with specific columns
  - DELETE queries: use soft delete by setting `deleted_at = NOW()`
  - Default ORDER BY: `ORDER BY created_at` when no orderByClause
- Use naming conventions:
  - File names: kebab-case (e.g., `options-service.js`)
  - Function names: camelCase with verb (e.g., `getOptions`, `createOption`)
  - PascalCase for table names in function names, plural for getAll, singular for other functions
- Implement database connection pattern:
  - Tagged template literals for single operations
  - `sql.query(sqlText, sqlValue)` for complex queries with dynamic parameters

## Notes

- Use SQL table definition to:
  - Extract table name and all column definitions
  - Exclude auto-managed columns (`id`, `created_at`, `updated_at`, `deleted_at`) from create/update operations
  - Identify business columns needed for SELECT statements
- parseSearchParams pattern:
  - Declare `const ignoredSearchColumns = [];` for columns ignored in search
  - Destructure result: `{ whereClause, orderByClause, limitClause, queryValues }`
  - Copy queryValues: `const sqlValue = [...queryValues];`
- SQL Connection patterns:
  - Initialize: ``
  - Get All: `sql.query(sqlText, sqlValue)` with string template and array values
  - Other functions: tagged template literals `sql\`query\`` with embedded variables
- Error handling:
  - Wrap all functions in try-catch blocks
  - Throw new Error(error.message) on errors
- Order and formatting:
  - Maintain consistent parameter order in SQL queries
  - Use line breaks and indentation for readable SQL queries
  - Always end SQL statements with semicolon

## Example

### Input (SQL Definition)

```sql
DROP TABLE IF EXISTS options CASCADE;
CREATE TABLE options (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL,
  option_table VARCHAR(255) NOT NULL,
  option_column VARCHAR(255) NOT NULL,
  option_label VARCHAR(255) NOT NULL,
  option_color VARCHAR(255) DEFAULT NULL,
  option_group VARCHAR(255) DEFAULT NULL
);
CREATE TRIGGER update_record BEFORE
UPDATE ON options FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Output (options-service.js)

```javascript
// path: @/service/options-service.js

import { getConnection } from "@/lib/db/neon";
import { parseSearchParams } from "@/lib/util/query-util";

const sql = getConnection();

export async function getOptions(searchParams) {
  try {
    const ignoredSearchColumns = [];
    const { whereClause, orderByClause, limitClause, queryValues } =
      parseSearchParams(searchParams, ignoredSearchColumns);

    const sqlValue = [...queryValues];
    const sqlText = `
      SELECT id, option_table, option_column, option_label, option_color, option_group,
        COUNT(*) OVER() AS total
      FROM options
      WHERE deleted_at IS NULL
      ${whereClause}
      ${orderByClause || "ORDER BY created_at"}
      ${limitClause};
    `;

    return await sql.query(sqlText, sqlValue);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getOption(id) {
  try {
    return await sql`
      SELECT id, option_table, option_column, option_label, option_color, option_group
      FROM options
      WHERE deleted_at IS NULL AND id = ${id};
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createOption(data) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    return await sql`
      INSERT INTO options (
        option_table, option_column, option_label, option_color, option_group
      ) VALUES (
        ${option_table}, ${option_column}, ${option_label}, ${option_color}, ${option_group}
      )
      RETURNING id, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateOption(data, id) {
  try {
    const {
      option_table,
      option_column,
      option_label,
      option_color,
      option_group,
    } = data;

    return await sql`
      UPDATE options
      SET option_table = ${option_table}, option_column = ${option_column}, option_label = ${option_label}, option_color = ${option_color}, option_group = ${option_group}
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteOption(id) {
  try {
    return await sql`
      UPDATE options
      SET deleted_at = NOW()
      WHERE deleted_at IS NULL AND id = ${id}
      RETURNING id, option_table, option_column, option_label, option_color, option_group;
    `;
  } catch (error) {
    throw new Error(error.message);
  }
}
```
