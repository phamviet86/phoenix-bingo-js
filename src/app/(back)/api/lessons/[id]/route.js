import {
  getLesson,
  updateLesson,
  deleteLesson,
} from "@/service/lessons-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const result = await getLesson(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy bài giảng.");

    return buildApiResponse(200, true, "Lấy thông tin bài giảng thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const {
      module_id,
      lesson_name,
      lesson_no = null,
      lesson_desc = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!module_id || !lesson_name)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      module_id,
      lesson_name,
      lesson_no,
      lesson_desc,
    };

    const result = await updateLesson(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy bài giảng hoặc bài giảng đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật bài giảng thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID bài giảng.");

    const result = await deleteLesson(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy bài giảng hoặc bài giảng đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa bài giảng thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
