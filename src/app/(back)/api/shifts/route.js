import { getShifts, createShift, updateShift } from "@/service/shifts-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getShifts(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách giờ học thành công", {
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
      shift_name,
      shift_start_time,
      shift_end_time,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!shift_name || !shift_start_time || !shift_end_time)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      shift_name,
      shift_start_time,
      shift_end_time,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing shift
      result = await updateShift(data, id);
      message = "Cập nhật giờ học thành công.";
      statusCode = 200;
    } else {
      // Create new shift
      result = await createShift(data);
      message = "Tạo giờ học thành công.";
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
