import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

/**
 * Bảng danh sách ghi danh với phân trang, lọc và sắp xếp
 */
export function EnrollmentTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/enrollments", params, sort, filter)
      }
    />
  );
}

/**
 * Form tạo và chỉnh sửa ghi danh
 */
export function EnrollmentForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/enrollments", values)}
    />
  );
}

/**
 * Drawer hiển thị thông tin chi tiết ghi danh
 */
export function EnrollmentInfo(props) {
  return <DrawerInfo {...props} />;
}

/**
 * Component mô tả chi tiết thông tin ghi danh
 */
export function EnrollmentDesc(props) {
  return <ProDescriptions {...props} />;
}
