---
mode: "edit"
description: "Tạo một file component hoàn chỉnh với các thao tác CRUD dựa trên tên bảng được cung cấp."
---

## Yêu cầu

- Tạo file component từ tên bảng:
  - `{table-name}-component.js` trong thư mục `/src/component/custom/{tableName}/`
  - Export năm functions: `{TableName}Table`, `{TableName}Desc`, `{TableName}Info`, `{TableName}FormCreate`, `{TableName}FormEdit`
- Bao gồm các thao tác CRUD hoàn chỉnh:
  - Table: Component hiển thị danh sách dữ liệu với pagination, filtering và sorting
  - Desc: Component hiển thị thông tin chi tiết bản ghi
  - Info: Component hiển thị modal dialog thông tin
  - FormCreate: Component tạo bản ghi mới
  - FormEdit: Component chỉnh sửa bản ghi hiện có
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Import statements từ common components và fetch utilities
  - Props spreading sử dụng destructuring pattern
  - API endpoint paths nhất quán với `/api/{tableName}`
  - Vietnamese titles cho forms và actions
- Bao gồm cấu hình component phù hợp:
  - Table component: sử dụng `onDataRequest` với `fetchList`
  - Form components: sử dụng `onDataSubmit` với `fetchPost`/`fetchPut`
  - Info component: sử dụng `DrawerInfo` wrapper
  - Description component: sử dụng `ProDescriptions` wrapper
- Sử dụng các quy ước đặt tên:
  - File names: kebab-case (ví dụ: `options-component.js`)
  - Function names: PascalCase với table name (ví dụ: `OptionTable`, `OptionFormCreate`)
  - Component titles: Vietnamese với proper context (ví dụ: "Tạo tùy chọn", "Sửa tùy chọn")
- Triển khai pattern component:
  - Destructuring cho id parameter trong edit forms: `{ id, ...props }`
  - Props spreading: `{...props}` cho tất cả components
  - Consistent API endpoint format: `/api/{tableName}` và `/api/{tableName}/${id}`

## Ghi chú

- Sử dụng tên bảng để:
  - Tạo PascalCase function names (ví dụ: "options" → "OptionTable")
  - Xác định API endpoints phù hợp
  - Tạo Vietnamese titles có ý nghĩa cho forms
- Import patterns:
  - Common components từ `@/component/common`: `ProTable`, `ProDescriptions`, `DrawerInfo`, `DrawerForm`
  - Fetch utilities từ `@/lib/util/fetch-util`: `fetchList`, `fetchPost`, `fetchPut`
- Component structure patterns:
  - Table: nhận `params, sort, filter` từ `onDataRequest`
  - Forms: nhận `values` từ `onDataSubmit`
  - Edit forms: nhận `id` riêng biệt và spread remaining props
- API call patterns:
  - GET list: `fetchList("/api/{tableName}", params, sort, filter)`
  - POST: `fetchPost("/api/{tableName}", values)`
  - PUT: `fetchPut(\`/api/{tableName}/${id}\`, values)`
- Vietnamese terminology:
  - Create: "Tạo [item name in Vietnamese]"
  - Edit: "Sửa [item name in Vietnamese]"
  - Use appropriate Vietnamese terms for each table context

## Ví dụ

### Đầu vào

```
Table: options
```

### Đầu ra (options-component.js)

```javascript
import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import { fetchList, fetchPost, fetchPut } from "@/lib/util/fetch-util";

export function OptionTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/options", params, sort, filter)
      }
    />
  );
}

export function OptionDesc(props) {
  return <ProDescriptions {...props} />;
}

export function OptionInfo(props) {
  return <DrawerInfo {...props} />;
}

export function OptionFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
      title="Tạo tùy chọn"
    />
  );
}

export function OptionFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataRequest={() => fetchList(`/api/options/${id}`)}
      onDataSubmit={(values) => fetchPut(`/api/options/${id}`, values)}
      title="Sửa tùy chọn"
    />
  );
}
```
