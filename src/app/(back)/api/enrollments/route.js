import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
} from "@/service/enrollments-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getEnrollments(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách ghi danh thành công", {
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

    // Validate date logic
    if (
      enrollment_start_date &&
      enrollment_end_date &&
      new Date(enrollment_start_date) > new Date(enrollment_end_date)
    )
      return buildApiResponse(
        400,
        false,
        "Ngày bắt đầu không thể sau ngày kết thúc"
      );

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

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing enrollment
      result = await updateEnrollment(data, id);
      message = "Cập nhật ghi danh thành công.";
      statusCode = 200;
    } else {
      // Create new enrollment
      result = await createEnrollment(data);
      message = "Tạo ghi danh thành công.";
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
