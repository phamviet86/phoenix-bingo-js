import { useState } from "react";
import {
  ProTable,
  DrawerForm,
  DrawerInfo,
  ProDescriptions,
  ModalSteps,
} from "@/component/common";
import { fetchList, fetchPost } from "@/lib/util/fetch-util";

export function EnrollmentsTable(props) {
  return (
    <ProTable
      {...props}
      onDataRequest={(params, sort, filter) =>
        fetchList("/api/enrollments", params, sort, filter)
      }
    />
  );
}

export function EnrollmentsForm(props) {
  return (
    <DrawerForm
      {...props}
      onDataSubmit={(values) => fetchPost("/api/enrollments", values)}
    />
  );
}

export function EnrollmentsInfo(props) {
  return <DrawerInfo {...props} />;
}

export function EnrollmentsDesc(props) {
  return <ProDescriptions {...props} />;
}

export function EnrollmentsAdd({
  classId,
  userTableColumns,
  sectionTableColumns,
  ...props
}) {
  const [filterRole, setFilterRole] = useState("Giáo viên");
  const [selectTypeId, setSelectTypeId] = useState("8");
  const [selectUserId, setSelectUserId] = useState(null);
  const [selectSectionData, setSelectSectionData] = useState([]);

  const handleSelectType = (key) => {
    setSelectTypeId(key);
    if (key === "8") {
      setFilterRole("giáo viên");
    }
    if (key === "9") {
      setFilterRole("trợ giảng");
    }
  };

  const handleSelectUser = (selectedRows) =>
    setSelectUserId(selectedRows[0].id);

  const handleSelectSection = (selectedRows) => {
    const sections = selectedRows.map((row) => ({
      section_id: row.id,
      module_id: row.module_id,
    }));
    setSelectSectionData(sections);
  };

  const steps = [
    {
      title: "Chọn người dùng",
      content: (
        <ProTable
          onDataRequest={async (params, sort, filter) =>
            await fetchList("/api/users", params, sort, filter)
          }
          columns={userTableColumns}
          params={{ role_names: filterRole }}
          onRowsSelect={handleSelectUser}
          selectType="radio"
          showSearch={false}
          toolbar={{
            multipleLine: true,
            tabs: {
              activeKey: selectTypeId,
              onChange: handleSelectType,
              items: [
                {
                  key: "8",
                  tab: "Giáo viên",
                },
                {
                  key: "9",
                  tab: "Trợ giảng",
                },
              ],
            },
          }}
        />
      ),
    },
    {
      title: "Chọn học phần",
      content: (
        <ProTable
          onDataRequest={async (params, sort, filter) =>
            await fetchList(
              `/api/classes/${classId}/sections`,
              params,
              sort,
              filter
            )
          }
          columns={sectionTableColumns}
          onRowsSelect={handleSelectSection}
          selectType="checkbox"
          showSearch={false}
        />
      ),
    },
  ];

  return (
    <ModalSteps
      {...props}
      title={`Thêm ${filterRole}`}
      onModalOk={async () =>
        await fetchPost(`/api/classes/${classId}/enrollments`, {
          typeId: selectTypeId,
          userId: selectUserId,
          sectionData: selectSectionData,
        })
      }
      showOkMessage={true}
      steps={steps}
      stepsProps={{ progressDot: true }}
      afterClose={() => {
        setFilterRole("giáo viên");
        setSelectTypeId(8);
        setSelectUserId(null);
        setSelectSectionData([]);
      }}
    />
  );
}
