import { getRoles, createRole, updateRole } from "@/service/roles-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getRoles(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách vai trò thành công", {
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
      role_name,
      role_path,
      role_color,
    } = await request.json();

    const data = {
      role_name,
      role_path,
      role_color,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing role
      result = await updateRole(data, id);
      message = "Cập nhật vai trò thành công.";
      statusCode = 200;
    } else {
      // Create new role
      result = await createRole(data);
      message = "Tạo vai trò thành công.";
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
