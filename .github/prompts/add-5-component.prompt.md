---
mode: "edit"
description: "Tạo một file component hoàn chỉnh với các thao tác CRUD dựa trên tên bảng được cung cấp."
---

## Yêu cầu

- Tạo file component từ tên bảng:
  - `{table-name}-component.js` trong thư mục `/src/component/custom/{tableName}/`
  - Export bốn functions: `{TableName}Table`, `{TableName}Desc`, `{TableName}Info`, `{TableName}Form`
- Bao gồm các thao tác CRUD hoàn chỉnh:
  - Table: Component hiển thị danh sách dữ liệu với pagination, filtering và sorting
  - Desc: Component hiển thị thông tin chi tiết bản ghi
  - Info: Component hiển thị drawer thông tin
  - Form: Component tạo và chỉnh sửa bản ghi (đa năng cho cả create và edit)
- Tuân theo các mẫu đã thiết lập của dự án cho:
  - Import statements từ common components và fetch utilities
  - Props spreading sử dụng destructuring pattern
  - API endpoint paths nhất quán với `/api/{tableName}`
  - Vietnamese titles cho forms và actions
- Bao gồm cấu hình component phù hợp:
  - Table component: sử dụng `onDataRequest` với `fetchList`
  - Form component: sử dụng `onDataSubmit` với `fetchPost` (mặc định cho create)
  - Info component: sử dụng `DrawerInfo` wrapper
  - Description component: sử dụng `ProDescriptions` wrapper
- Sử dụng các quy ước đặt tên:
  - File names: kebab-case (ví dụ: `options-component.js`)
  - Function names: PascalCase với table name (ví dụ: `OptionTable`, `OptionForm`)
  - Component titles: Vietnamese với proper context (ví dụ: "Tạo tùy chọn", "Sửa tùy chọn")
- Triển khai pattern component:
  - Props spreading: `{...props}` cho tất cả components
  - Consistent API endpoint format: `/api/{tableName}`

## Ghi chú

- Sử dụng tên bảng để:
  - Tạo PascalCase function names (ví dụ: "options" → "OptionTable")
  - Xác định API endpoints phù hợp
  - Tạo Vietnamese titles có ý nghĩa cho forms
- Import patterns:
  - Common components từ `@/component/common`: `ProTable`, `ProDescriptions`, `DrawerInfo`, `DrawerForm`
  - Fetch utilities từ `@/lib/util/fetch-util`: `fetchList`, `fetchGet`, `fetchPost`, `fetchPut`
- Component structure patterns:
  - Table: nhận `params, sort, filter` từ `onDataRequest`
  - Form: nhận `values` từ `onDataSubmit`, sử dụng `fetchPost` mặc định
- API call patterns:
  - GET list: `fetchList("/api/{tableName}", params, sort, filter)`
  - POST: `fetchPost("/api/{tableName}", values)`
- Vietnamese terminology:
  - Create: "Tạo [item name in Vietnamese]"
  - Edit: "Sửa [item name in Vietnamese]"
  - Use appropriate Vietnamese terms for each table context
- JSDoc comments:
  - Sử dụng tiếng Việt để mô tả functionality
  - Bao gồm thông tin về props và usage patterns
  - Ghi rõ mục đích và cách sử dụng của từng component

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
import {
  fetchList,
  fetchGet,
  fetchPost,
  fetchPut,
} from "@/lib/util/fetch-util";

/**
 * Component bảng hiển thị danh sách tùy chọn
 * Hỗ trợ phân trang, lọc và sắp xếp dữ liệu
 */
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

/**
 * Component mô tả thông tin chi tiết tùy chọn
 * Sử dụng ProDescriptions để hiển thị dữ liệu
 */
export function OptionDesc(props) {
  return <ProDescriptions {...props} />;
}

/**
 * Component drawer hiển thị thông tin tùy chọn
 * Bao bọc OptionDesc trong DrawerInfo
 */
export function OptionInfo(props) {
  return <DrawerInfo {...props} />;
}

/**
 * Component form tạo và chỉnh sửa tùy chọn
 * Mặc định sử dụng POST request cho việc tạo mới
 */
export function OptionForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/options", values)}
    />
  );
}
```
