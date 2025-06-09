---
mode: "edit"
description: "Create a complete component file with CRUD operations based on provided table name."
---

## Requirements

- Create component file from table name:
  - `{table-name}-component.js` in `/src/component/custom/{tableName}/` directory
  - Export four functions: `{TableName}Table`, `{TableName}Desc`, `{TableName}Info`, `{TableName}Form`
- Include complete CRUD operations:
  - Table: Component to display data list with pagination, filtering and sorting
  - Desc: Component to display detailed record information
  - Info: Component to display information drawer
  - Form: Component to create and edit records (versatile for both create and edit)
- Follow established project patterns for:
  - Import statements from common components and fetch utilities
  - Props spreading using destructuring pattern
  - Consistent API endpoint paths with `/api/{tableName}`
  - Vietnamese titles for forms and actions
- Include appropriate component configuration:
  - Table component: use `onDataRequest` with `fetchList`
  - Form component: use `onDataSubmit` with `fetchPost` (default for create)
  - Info component: use `DrawerInfo` wrapper
  - Description component: use `ProDescriptions` wrapper
- Use naming conventions:
  - File names: kebab-case (e.g., `options-component.js`)
  - Function names: PascalCase with table name (e.g., `OptionsTable`, `OptionsForm`)
  - Component titles: Vietnamese with proper context (e.g., "Tạo tùy chọn", "Sửa tùy chọn")
- Implement component pattern:
  - Props spreading: `{...props}` for all components
  - Consistent API endpoint format: `/api/{tableName}`

## Notes

- Use table name to:
  - Create PascalCase function names (e.g., "options" → "OptionsTable")
  - Determine appropriate API endpoints
  - Create meaningful Vietnamese titles for forms
- Import patterns:
  - Common components from `@/component/common`: `ProTable`, `ProDescriptions`, `DrawerInfo`, `DrawerForm`
  - Fetch utilities from `@/lib/util/fetch-util`: `fetchList`, `fetchPost`
- Component structure patterns:
  - Table: receives `params, sort, filter` from `onDataRequest`
  - Form: receives `values` from `onDataSubmit`, uses `fetchPost` by default
- API call patterns:
  - GET list: `fetchList("/api/{tableName}", params, sort, filter)`
  - POST: `fetchPost("/api/{tableName}", values)`
- Vietnamese terminology:
  - Create: "Tạo [item name in Vietnamese]"
  - Edit: "Sửa [item name in Vietnamese]"
  - Use appropriate Vietnamese terms for each table context
- JSDoc comments:
  - Use Vietnamese to describe functionality
  - Include information about props and usage patterns
  - Clearly state purpose and usage of each component

## Example

### Input

```
Table: options
```

### Output (options-component.js)

```javascript
// path: @/component/custom/options/options-component.js

import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function OptionsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}

export function OptionsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function OptionsDesc(props) {
  return <ProDescriptions {...props} />;
}
```
