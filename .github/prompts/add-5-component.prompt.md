# Table Component Generator

## Objective

Generate a set of component functions for performing CRUD operations based on a provided table name.

## Requirements

- Accept a table name as input (e.g., "options", "resources", "roles").
- Use `/api/{tableName}` as the base URL for all API operations.
- Generate six component functions with PascalCase naming based on the table name:
  - `{TableName}Table`: Component for displaying data
  - `{TableName}Description`: Component for showing detailed record information
  - `{TableName}Info`: Component for displaying a modal dialog
  - `{TableName}FormCreate`: Component for creating new records
  - `{TableName}FormEdit`: Component for editing existing records
  - `{TableName}DeleteButton`: Component for deleting records
- Import standard components from `@/components/common`: `ProTable`, `ProDescriptions`, `DrawerForm`, `ModalDescriptions`, `DeleteConfirm`, `Button`.
- Import fetch utilities from `@/lib/helpers/fetch-helper`: `fetchLIST`, `fetchPOST`, `fetchPUT`, `fetchGET`, `fetchDELETE`.
- Use Vietnamese labels: "Tạo" for create actions, "Xoá" for delete actions.
- Apply appropriate button styling: primary/solid for create, danger/solid for delete.
- Handle props spreading consistently using destructuring.
- Use `DrawerForm` component for form operations (not `ModalForm`).
- Include Vietnamese titles for forms: "Tạo [item]" for create, "Sửa [item]" for edit.
- Save the generated file to `/src/components/{tableName}/{tableName}-component.js`.
- Create or update `/src/components/{tableName}/index.js` to export the component.

## Notes

- Ensure each component function is independently exported.
- The API endpoint paths should be consistent as `/api/{tableName}` across all operations.
- Keep the component structure simple and focused on specific functionality.
- The index.js file should export all functions from the component file.

## Example:

### Input: "rooms"

### Output rooms-component.js:

```javascript
import {
  ProTable,
  ProDescriptions,
  DrawerForm,
  ModalDescriptions,
  DeleteConfirm,
  Button,
} from "@/components/common";
import {
  fetchLIST,
  fetchPOST,
  fetchPUT,
  fetchGET,
  fetchDELETE,
} from "@/lib/helpers/fetch-helper";

export function RoomTable(props) {
  return (
    <ProTable
      {...props}
      fetch={async (params, sort, filter) =>
        await fetchLIST("/api/rooms", params, sort, filter)
      }
    />
  );
}

export function RoomDescription({ id, ...props }) {
  return (
    <ProDescriptions
      {...props}
      fetch={async () => await fetchGET("/api/rooms", id)}
    />
  );
}

export function RoomInfo(props) {
  return <ModalDescriptions {...props} title="Thông tin" />;
}

export function RoomFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      submit={async (values) => await fetchPOST("/api/rooms", values)}
      title="Tạo phòng học"
    />
  );
}

export function RoomFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      fetch={async () => await fetchGET("/api/rooms", id)}
      submit={async (values) => await fetchPUT("/api/rooms", id, values)}
      title="Sửa phòng học"
    />
  );
}

export function RoomDeleteButton({ id, ...props }) {
  return (
    <DeleteConfirm
      {...props}
      accept={async () => await fetchDELETE("/api/rooms", id)}
    >
      <Button label="Xoá" color="danger" variant="solid" />
    </DeleteConfirm>
  );
}
```

### Output index.js:

```javascript
export * from "@/components/rooms/rooms-component";
export * from "@/components/rooms/rooms-schema";
```
