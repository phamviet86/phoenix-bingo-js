import {
  getSchedules,
  createSchedule,
  updateSchedule,
} from "@/service/schedules-service";
import { getSection } from "@/service/sections-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";
import { isDateInRange } from "@/lib/util/check-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getSchedules(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lịch học thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const {
      id = null,
      section_id,
      lesson_id = null,
      shift_id,
      room_id = null,
      schedule_date,
      schedule_status_id,
      schedule_desc = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!section_id || !shift_id || !schedule_date || !schedule_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    // get section to validate if it exists
    const section = await getSection(section_id);
    if (!section || !section.length)
      return buildApiResponse(404, false, "Không tìm thấy lộ trình.");

    const { section_start_date, section_end_date } = section[0];
    const isValidDate = isDateInRange(
      section_start_date,
      section_end_date,
      schedule_date
    );
    if (!isValidDate) {
      // Format dates for display in error message
      const formatDate = (date) => {
        if (!date) return "không xác định";
        return new Date(date).toLocaleDateString("vi-VN");
      };

      let errorMsg = "";
      if (section_start_date && section_end_date) {
        // Case 1: Both start and end dates exist
        errorMsg = `Ngày học phải nằm trong khoảng từ ${formatDate(
          section_start_date
        )} đến ${formatDate(section_end_date)}`;
      } else if (section_start_date && !section_end_date) {
        // Case 2: Only start date exists
        errorMsg = `Ngày học phải từ ${formatDate(section_start_date)} trở đi`;
      } else {
        // Fallback message
        errorMsg = "Ngày học không hợp lệ.";
      }

      return buildApiResponse(400, false, errorMsg);
    }

    const data = {
      section_id,
      lesson_id,
      shift_id,
      room_id,
      schedule_date,
      schedule_status_id,
      schedule_desc,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing schedule
      result = await updateSchedule(data, id);
      message = "Cập nhật lịch học thành công.";
      statusCode = 200;
    } else {
      // Create new schedule
      result = await createSchedule(data);
      message = "Tạo lịch học thành công.";
      statusCode = 201;
    }

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(statusCode, true, message, {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
