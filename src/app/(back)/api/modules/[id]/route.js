import {
  getModule,
  updateModule,
  deleteModule,
} from "@/service/modules-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID học phần.");

    const result = await getModule(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy học phần.");

    return buildApiResponse(200, true, "Lấy thông tin học phần thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID học phần.");

    const { course_id, module_name, module_desc = null } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_id || !module_name)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_id,
      module_name,
      module_desc,
    };

    const result = await updateModule(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy học phần hoặc học phần đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật học phần thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID học phần.");

    const result = await deleteModule(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy học phần hoặc học phần đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa học phần thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
