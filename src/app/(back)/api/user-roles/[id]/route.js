import {
  getUserRole,
  updateUserRole,
  deleteUserRole,
} from "@/service/user-roles-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function GET(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID phân quyền.");

    const result = await getUserRole(id);
    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy phân quyền.");

    return buildApiResponse(200, true, "Lấy thông tin phân quyền thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID phân quyền.");

    const { user_id, role_id } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!user_id || !role_id)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      user_id,
      role_id,
    };

    const result = await updateUserRole(data, id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy phân quyền hoặc phân quyền đã bị xóa."
      );

    return buildApiResponse(200, true, "Cập nhật phân quyền thành công.", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID phân quyền.");

    const result = await deleteUserRole(id);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy phân quyền hoặc phân quyền đã bị xóa."
      );

    return buildApiResponse(200, true, "Xóa phân quyền thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
