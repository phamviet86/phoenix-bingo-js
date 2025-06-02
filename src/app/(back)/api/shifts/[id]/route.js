import { getShift, updateShift, deleteShift } from "@/service/shifts-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID giờ học.");

    const result = await getShift(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy giờ học.");

    return buildApiResponse(200, true, "Lấy thông tin giờ học thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID giờ học.");

    const { shift_name, shift_start_time, shift_end_time } =
      await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!shift_name || !shift_start_time || !shift_end_time)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      shift_name,
      shift_start_time,
      shift_end_time,
    };

    const result = await updateShift(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giờ học hoặc giờ học đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật giờ học thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID giờ học.");

    const result = await deleteShift(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy giờ học hoặc giờ học đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa giờ học thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
