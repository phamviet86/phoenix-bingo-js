---
mode: "edit"
description: "Create page component for entity list with table display, create form, view information and detail link functionality."
---

## Requirements

- Create page component file:
  - `page.js` in `/src/app/(front)/app/dev/{tableName}/` directory
  - Use `"use client";` directive at the top of file
  - Import components from `/src/component/custom/` directory
- Include state management using hooks:
  - `useTable` - Manage table data, reload and reference
  - `useInfo` - Manage detail view state
  - `useForm` - Manage creation form state
- Implement main components:
  - Table component with entity name as prefix (e.g., `OptionsTable`)
  - Info view component (e.g., `OptionsInfo`) with drawer for quick information view
  - Form component (e.g., `OptionsForm`) for creation with proper hooks integration
- Follow established project patterns for:
  - Layout using `PageContainer` and `ProCard` components
  - Responsive design with boxShadow
  - Error handling and loading states
  - Action columns with Info and Detail buttons
- Include standard table operations:
  - pageButton: Create button with `PlusOutlined` icon
  - Left columns: Info button with `InfoCircleOutlined` icon to open drawer
  - Right columns: Detail button with `EyeOutlined` icon to navigate to detail page
- Use naming conventions:
  - PascalCase for entity component names (e.g., `OptionsTable`, `OptionsInfo`, `OptionsForm`)
  - Plural form for Columns and Fields (e.g., `OptionsColumns`, `OptionsFields`)
  - Vietnamese labels for UI text
  - Proper breadcrumb structure with title hierarchy

## Notes

- Use SQL table definition to:
  - Identify entity name and table name
  - Create appropriate breadcrumb and title
  - Import correct components from custom components
- Page structure pattern:
  - PageContainer with breadcrumb items and title
  - ProCard wrapper with boxShadow
  - Table component with left/right columns
  - Info drawer with footer actions
  - Create form with proper hooks integration
- State management pattern:
  - Use hook.open(record) to open info drawer or form
  - Use hook.close() to close drawer
  - Reload table after successful submit with callback
- Vietnamese localization patterns:
  - Breadcrumb: "Hệ thống" for system level
  - Page title: "Quản lý {Vietnamese entity name}"
  - Create button: "Tạo mới"
  - Info drawer title: "Thông tin {Vietnamese entity name}"
  - Form title: "Tạo {Vietnamese entity name}"
  - Detail button: "Chi tiết"
- Component import structure:
  - Common components from `@/component/common`
  - Custom components from `@/component/custom`
  - Hooks from `@/component/hook`
  - Icons from `@ant-design/icons`
  - ProCard from `@ant-design/pro-components`
- Navigation pattern:
  - Info button opens drawer for quick information view
  - Detail button navigates to separate detail page
  - Info drawer footer has Detail button for page navigation

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

### Output (page.js)

```javascript
"use client";

import {
  PlusOutlined,
  EyeOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, DetailButton } from "@/component/common";
import {
  OptionsTable,
  OptionsInfo,
  OptionsForm,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const optionTable = useTable();
  const optionInfo = useInfo();
  const optionForm = useForm();

  const pageButton = [
    <Button
      key="create-button"
      label="Tạo mới"
      icon={<PlusOutlined />}
      onClick={() => {
        optionForm.setRecord({});
        optionForm.open();
      }}
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionsTable
        tableHook={optionTable}
        columns={OptionsColumns()}
        leftColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <Button
                icon={<InfoCircleOutlined />}
                variant="link"
                onClick={() => {
                  optionInfo.setRecord(record);
                  optionInfo.open();
                }}
              />
            ),
          },
        ]}
        rightColumns={[
          {
            width: 56,
            align: "center",
            search: false,
            render: (_, record) => (
              <DetailButton
                id={record.id}
                icon={<EyeOutlined />}
                variant="link"
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <OptionsInfo
        infoHook={optionInfo}
        columns={OptionsColumns()}
        dataSource={optionInfo.record}
        drawerProps={{
          title: "Thông tin tùy chọn",
          footer: [
            <DetailButton
              key="detail-button"
              id={optionInfo.record.id}
              label="Chi tiết"
              icon={<EyeOutlined />}
              onClick={() => optionInfo.close()}
            />,
          ],
        }}
      />
      <OptionsForm
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionTable.reload()}
        title="Tạo tùy chọn"
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[{ title: "Hệ thống" }, { title: "Tùy chọn" }]}
      title="Quản lý tùy chọn"
      extra={pageButton}
      content={pageContent}
    />
  );
}
```
