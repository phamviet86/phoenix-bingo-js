import {
  getSections,
  createSection,
  updateSection,
} from "@/service/sections-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getSections(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lộ trình thành công", {
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
      class_id,
      module_id,
      section_start_date = null,
      section_end_date = null,
      section_fee = 0,
      section_total_fee = 0,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!class_id || !module_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    // Validate date logic
    if (
      section_start_date &&
      section_end_date &&
      new Date(section_start_date) > new Date(section_end_date)
    )
      return buildApiResponse(
        400,
        false,
        "Ngày bắt đầu không thể sau ngày kết thúc"
      );

    const data = {
      class_id,
      module_id,
      section_start_date,
      section_end_date,
      section_fee,
      section_total_fee,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing section
      result = await updateSection(data, id);
      message = "Cập nhật lộ trình thành công.";
      statusCode = 200;
    } else {
      // Create new section
      result = await createSection(data);
      message = "Tạo lộ trình thành công.";
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
