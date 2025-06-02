---
mode: "edit"
description: "Tạo page component hoàn chỉnh cho quản lý entity với chức năng hiển thị bảng, form tạo mới, form chỉnh sửa và xem chi tiết."
---

## Yêu cầu

- Tạo file page component:
  - `page.js` trong thư mục `/src/app/(front)/app/{tableName}/`
  - Sử dụng `"use client";` directive ở đầu file
  - Import các component từ thư mục `/src/component/custom/`
- Bao gồm state management sử dụng các hooks:
  - `useTable` - Quản lý dữ liệu bảng, reload và reference
  - `useForm` - Quản lý visibility form, record ID, show/hide forms
  - `useInfo` - Quản lý state của detail view
- Implement các component chính:
  - Table component với entity name làm prefix (ví dụ: `OptionTable`)
  - Creation form component (ví dụ: `OptionFormCreate`) với reload callback
  - Edit form component (ví dụ: `OptionFormEdit`) với record ID và reload callback
  - Detail view component (ví dụ: `OptionInfo`) với các actions phù hợp
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Layout sử dụng `PageContainer` và `ProCard` components
  - Responsive design với proper shadows
  - Error handling và loading states
  - Action columns với Info và Edit buttons
- Bao gồm các thao tác bảng chuẩn:
  - pageButton: Create button với `PlusOutlined` icon
  - Left columns: Info button với `InfoCircleOutlined` icon
  - Right columns: Edit button với `EditOutlined` icon
- Sử dụng các quy ước đặt tên:
  - PascalCase cho entity component names (ví dụ: `OptionTable`, `OptionFormCreate`)
  - Vietnamese labels cho UI text
  - Proper breadcrumb structure với title hierarchy

## Ghi chú

- Sử dụng định nghĩa bảng SQL để:
  - Xác định tên entity và tên bảng
  - Tạo breadcrumb và title phù hợp
  - Import đúng các component từ custom components
- Page structure pattern:
  - PageContainer với breadcrumb items và title
  - ProCard wrapper với boxShadow
  - Table component với left/right columns
  - Info drawer với footer actions
  - Edit form với proper hooks integration
- State management pattern:
  - Sử dụng hook.open(record) để mở forms/drawers
  - Sử dụng hook.close() để đóng forms/drawers
  - Reload table sau khi submit thành công
- Vietnamese localization patterns:
  - Breadcrumb: "Hệ thống" cho system level
  - Page title: "Quản lý {Vietnamese entity name}"
  - Create button: "Tạo mới"
  - Info drawer title: "Thông tin {Vietnamese entity name}"
  - Edit button: "Sửa"
- Component import structure:
  - Common components từ `@/component/common`
  - Custom components từ `@/component/custom`
  - Hooks từ `@/component/hook`
  - Icons từ `@ant-design/icons`

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

import {
  PlusOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { PageContainer, Button } from "@/component/common";
import {
  OptionTable,
  OptionInfo,
  OptionsColumns,
  OptionFormCreate,
  OptionFormEdit,
  OptionsFields,
} from "@/component/custom";
import { useTable, useInfo, useForm } from "@/component/hook";

export default function Page() {
  const optionTable = useTable();
  const optionInfo = useInfo();
  const optionForm = useForm();

  const pageButton = [
    <OptionFormCreate
      fields={OptionsFields()}
      onDataSubmitSuccess={() => optionTable.reload()}
      trigger={
        <Button key="create-button" label="Tạo mới" icon={<PlusOutlined />} />
      }
    />,
  ];

  const pageContent = (
    <ProCard boxShadow>
      <OptionTable
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
                onClick={() => optionInfo.open(record)}
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
              <Button
                icon={<EditOutlined />}
                variant="link"
                onClick={() => {
                  optionForm.open(record);
                }}
              />
            ),
            responsive: ["md"],
          },
        ]}
      />
      <OptionInfo
        infoHook={optionInfo}
        columns={OptionsColumns()}
        dataSource={optionInfo.record}
        drawerProps={{
          title: "Thông tin tùy chọn",
          footer: [
            <Button
              key="edit-button"
              label="Sửa"
              onClick={() => {
                optionInfo.close();
                optionForm.open(optionInfo.record);
              }}
            />,
          ],
        }}
      />
      <OptionFormEdit
        formHook={optionForm}
        fields={OptionsFields()}
        onDataSubmitSuccess={() => optionTable.reload()}
        initialValues={optionForm.record}
        id={optionForm.record.id}
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
