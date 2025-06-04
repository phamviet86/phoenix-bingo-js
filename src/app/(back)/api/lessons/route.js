import {
  getLessons,
  createLesson,
  updateLesson,
} from "@/service/lessons-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getLessons(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách bài giảng thành công", {
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

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing lesson
      result = await updateLesson(data, id);
      message = "Cập nhật bài giảng thành công.";
      statusCode = 200;
    } else {
      // Create new lesson
      result = await createLesson(data);
      message = "Tạo bài giảng thành công.";
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
