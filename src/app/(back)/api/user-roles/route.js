import {
  getUserRoles,
  createUserRole,
  updateUserRole,
} from "@/service/user-roles-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getUserRoles(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách phân quyền thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const { id = null, user_id, role_id } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !role_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      user_id,
      role_id,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing user role
      result = await updateUserRole(data, id);
      message = "Cập nhật phân quyền thành công.";
      statusCode = 200;
    } else {
      // Create new user role
      result = await createUserRole(data);
      message = "Tạo phân quyền thành công.";
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
