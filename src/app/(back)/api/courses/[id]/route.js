import {
  getCourse,
  updateCourse,
  deleteCourse,
} from "@/service/courses-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const result = await getCourse(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy giáo trình.");

    return buildApiResponse(200, true, "Lấy thông tin giáo trình thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const { course_name, course_status_id } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_name || !course_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_name,
      course_status_id,
    };

    const result = await updateCourse(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giáo trình hoặc giáo trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật giáo trình thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID giáo trình.");

    const result = await deleteCourse(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giáo trình hoặc giáo trình đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa giáo trình thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
