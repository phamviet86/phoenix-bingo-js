import { useState } from "react";
import { Radio } from "antd";
import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  ModalSteps,
  Transfer,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

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

export function EnrollmentForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/enrollments", values)}
    />
  );
}

export function EnrollmentInfo(props) {
  return <DrawerInfo {...props} />;
}

export function EnrollmentDesc(props) {
  return <ProDescriptions {...props} />;
}

export function EnrollmentModal(props) {
  const [showRole, setShowRole] = useState("Giáo viên");
  const [selectTypeId, setSelectTypeId] = useState(11);
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectSections, setSelectSections] = useState([]);

  return <DrawerForm {...props} />;
}
