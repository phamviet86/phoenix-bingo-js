import {
  getEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "@/service/enrollments-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID ghi danh.");

    const result = await getEnrollment(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy ghi danh.");

    return buildApiResponse(200, true, "Lấy thông tin ghi danh thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID ghi danh.");

    const {
      user_id,
      module_id,
      section_id = null,
      enrollment_type_id,
      enrollment_payment_type_id = null,
      enrollment_payment_amount = 0,
      enrollment_payment_discount = 0,
      enrollment_start_date = null,
      enrollment_end_date = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !module_id || !enrollment_type_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      user_id,
      module_id,
      section_id,
      enrollment_type_id,
      enrollment_payment_type_id,
      enrollment_payment_amount,
      enrollment_payment_discount,
      enrollment_start_date,
      enrollment_end_date,
    };

    const result = await updateEnrollment(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy ghi danh hoặc ghi danh đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật ghi danh thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID ghi danh.");

    const result = await deleteEnrollment(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy ghi danh hoặc ghi danh đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa ghi danh thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
