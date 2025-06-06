import { getClass, updateClass, deleteClass } from "@/service/classes-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const result = await getClass(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lớp học.");

    return buildApiResponse(200, true, "Lấy thông tin lớp học thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const { class_name, class_code } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!class_name || !class_code)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      class_name,
      class_code,
    };

    const result = await updateClass(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lớp học hoặc lớp học đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật lớp học thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const result = await deleteClass(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy lớp học hoặc lớp học đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa lớp học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
