---
mode: "edit"
description: "Tạo page component chi tiết cho entity với chức năng hiển thị thông tin và form chỉnh sửa."
---

## Yêu cầu

- Tạo file page component:
  - `page.js` trong thư mục `/src/app/(front)/app/{tableName}/[id]/`
  - Sử dụng `"use client";` directive ở đầu file
  - Import các component từ thư mục `/src/component/custom/`
- Bao gồm state management sử dụng các hooks:
  - `useDesc` - Quản lý dữ liệu mô tả entity
  - `useForm` - Quản lý visibility form chỉnh sửa
- Implement các component chính:
  - Desc component với entity name làm prefix (ví dụ: `OptionDesc`)
  - Edit form component (ví dụ: `OptionFormEdit`) với record ID và reload callback
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Layout sử dụng `PageContainer` và `ProCard` components
  - Responsive design với proper borders
  - Error handling và loading states
  - Dynamic page title và breadcrumb
- Bao gồm các thao tác trang chuẩn:
  - pageButton: BackButton và Edit button với `EditOutlined` icon
  - Dynamic title từ entity record
- Sử dụng các quy ước đặt tên:
  - PascalCase cho entity component names (ví dụ: `OptionDesc`, `OptionFormEdit`)
  - Vietnamese labels cho UI text
  - Proper breadcrumb structure với title hierarchy

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Xác định tên entity và tên bảng
  - Tạo breadcrumb và title phù hợp
  - Import đúng các component từ custom components
- Page structure pattern:
  - PageContainer với breadcrumb items và dynamic title
  - ProCard wrapper với bordered style
  - Desc component với params integration
  - Edit form với trigger button
- State management pattern:
  - Sử dụng use(params) để lấy ID từ URL
  - Dynamic title từ entity record
  - Set document.title cho SEO
  - Reload desc sau khi edit thành công
- Vietnamese localization patterns:
  - Breadcrumb: "Hệ thống" cho system level
  - Page title: Dynamic từ entity record hoặc "Chi tiết"
  - Edit button: "Sửa"
  - Back button: Tự động
- Component import structure:
  - Common components từ `@/component/common`
  - Custom components từ `@/component/custom`
  - Hooks từ `@/component/hook`
  - Icons từ `@ant-design/icons`
  - React hooks: `use` từ "react"
- Provider pattern:
  - Sử dụng PageProvider wrapper nếu cần context
  - Separate PageContent component để nhận props

## Ví dụ

### Đầu vào (Định nghĩa SQL)

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

### Đầu ra (page.js)

```javascript
"use client";

import { use } from "react";
import { EditOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button, BackButton } from "@/component/common";
import {
  OptionDesc,
  OptionFormEdit,
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
    <OptionFormEdit
      formHook={optionForm}
      fields={OptionsFields()}
      id={optionId}
      onDataSubmitSuccess={() => optionDesc.reload()}
      trigger={<Button key="edit-button" label="Sửa" icon={<EditOutlined />} />}
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
