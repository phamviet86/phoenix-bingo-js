import {
  getCourses,
  createCourse,
  updateCourse,
} from "@/service/courses-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getCourses(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách giáo trình thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const { id = null, course_name, course_status_id } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_name || !course_status_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_name,
      course_status_id,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing course
      result = await updateCourse(data, id);
      message = "Cập nhật giáo trình thành công.";
      statusCode = 200;
    } else {
      // Create new course
      result = await createCourse(data);
      message = "Tạo giáo trình thành công.";
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
