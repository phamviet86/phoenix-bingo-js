import {
  getModules,
  createModule,
  updateModule,
} from "@/service/modules-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getModules(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách học phần thành công", {
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
      course_id,
      module_name,
      module_desc = null,
    } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!course_id || !module_name)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      course_id,
      module_name,
      module_desc,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing module
      result = await updateModule(data, id);
      message = "Cập nhật học phần thành công.";
      statusCode = 200;
    } else {
      // Create new module
      result = await createModule(data);
      message = "Tạo học phần thành công.";
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
