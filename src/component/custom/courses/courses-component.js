import {
  ProTable,
  ProDescriptions,
  DrawerInfo,
  DrawerForm,
} from "@/component/common";
import { fetchList, fetchPost, fetchPut } from "@/lib/util/fetch-util";

export function CourseTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/courses", params, sort, filter)
      }
    />
  );
}

export function CourseDesc(props) {
  return <ProDescriptions {...props} />;
}

export function CourseInfo(props) {
  return <DrawerInfo {...props} />;
}

export function CourseFormCreate(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/courses", values)}
      title="Tạo khóa học"
    />
  );
}

export function CourseFormEdit({ id, ...props }) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPut(`/api/courses/${id}`, values)}
      title="Sửa khóa học"
    />
  );
}
