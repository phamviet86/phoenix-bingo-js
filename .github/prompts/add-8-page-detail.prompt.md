---
mode: "edit"
description: "Create detail page component for entity with display information and edit form functionality."
---

## Requirements

- Create page component file:
  - `page.js` in `/src/app/(front)/app/{tableName}/[id]/` directory
  - Use `"use client";` directive at the top of file
  - Import components from `/src/component/custom/` directory
- Include state management using hooks:
  - `useDesc` - Manage entity description data
  - `useForm` - Manage edit form visibility
- Implement main components:
  - Desc component with entity name as prefix (e.g., `OptionDesc`)
  - Edit form component (e.g., `OptionFormEdit`) with record ID and reload callback
- Follow established project patterns for:
  - Layout using `PageContainer` and `ProCard` components
  - Responsive design with proper borders
  - Error handling and loading states
  - Dynamic page title and breadcrumb
- Include standard page operations:
  - pageButton: BackButton and Edit button with `EditOutlined` icon
  - Dynamic title from entity record
- Use naming conventions:
  - PascalCase for entity component names (e.g., `OptionDesc`, `OptionFormEdit`)
  - Vietnamese labels for UI text
  - Proper breadcrumb structure with title hierarchy

## Notes

- Use SQL table definition to:
  - Identify entity name and table name
  - Create appropriate breadcrumb and title
  - Import correct components from custom components
- Page structure pattern:
  - PageContainer with breadcrumb items and dynamic title
  - ProCard wrapper with bordered style
  - Desc component with params integration
  - Edit form with trigger button
- State management pattern:
  - Use use(params) to get ID from URL
  - Dynamic title from entity record
  - Set document.title for SEO
  - Reload desc after successful edit
- Vietnamese localization patterns:
  - Breadcrumb: "Hệ thống" for system level
  - Page title: Dynamic from entity record or "Chi tiết"
  - Edit button: "Sửa"
  - Back button: Automatic
- Component import structure:
  - Common components from `@/component/common`
  - Custom components from `@/component/custom`
  - Hooks from `@/component/hook`
  - Icons from `@ant-design/icons`
  - React hooks: `use` from "react"
- Provider pattern:
  - Use PageProvider wrapper if context needed
  - Separate PageContent component to receive props

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

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  OptionDesc,
  OptionForm,
  OptionsColumns,
  OptionsFields,
} from "@/component/custom";
import { useDesc, useForm } from "@/component/hook";

export default function Page(props) {
  return <PageContent {...props} />;
}

function PageContent({ params }) {
  const { id: optionId } = use(params);

  // option sections
  const optionDesc = useDesc();
  const optionForm = useForm();

  const pageTitle = optionDesc?.record?.option_label || "Chi tiết";
  document.title = `Tùy chọn - ${pageTitle}`;

  const pageButton = [
    <BackButton key="back-button" />,
    <Button
      key="edit-button"
      label="Sửa"
      icon={<EditOutlined />}
      onClick={() => optionForm.open(optionDesc.record)}
    />,
  ];

  const pageContent = (
    <ProCard bordered>
      <OptionDesc
        descHook={optionDesc}
        columns={OptionsColumns()}
        params={{ id: optionId }}
        onDataRequestSuccess={(result) =>
          optionDesc.setRecord(result?.data?.[0])
        }
      />
      <OptionForm
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionDesc.reload()}
        initialValues={optionForm.record}
        title="Sửa giáo trình"
      />
    </ProCard>
  );

  return (
    <PageContainer
      items={[
        { title: "Hệ thống" },
        { title: "Tùy chọn", path: "/app/manager/options" },
        { title: pageTitle },
      ]}
      title={pageTitle}
      extra={pageButton}
      content={pageContent}
    />
  );
}
```
