import {
  getSection,
  updateSection,
  deleteSection,
} from "@/service/sections-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lộ trình.");

    const result = await getSection(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lộ trình.");

    return buildApiResponse(200, true, "Lấy thông tin lộ trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lộ trình.");

    const {
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

    const data = {
      class_id,
      module_id,
      section_start_date,
      section_end_date,
      section_fee,
      section_total_fee,
    };

    const result = await updateSection(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lộ trình hoặc lộ trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật lộ trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lộ trình.");

    const result = await deleteSection(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lộ trình hoặc lộ trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa lộ trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
