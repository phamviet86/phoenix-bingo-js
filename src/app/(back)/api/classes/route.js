import {
  getClasses,
  createClass,
  updateClass,
} from "@/service/classes-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getClasses(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lớp học thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const { id = null, class_name, class_code } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!class_name || !class_code)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      class_name,
      class_code,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing class
      result = await updateClass(data, id);
      message = "Cập nhật lớp học thành công.";
      statusCode = 200;
    } else {
      // Create new class
      result = await createClass(data);
      message = "Tạo lớp học thành công.";
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
