import {
  getUserRolesByUser,
  createUserRolesByUser,
  deleteUserRolesByUser,
} from "@/service/user-roles-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { searchParams } = new URL(request.url);
    const result = await getUserRolesByUser(searchParams, id);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách quyền thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createUserRolesByUser(id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm quyền.");

    return buildApiResponse(201, true, "Thêm quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { roleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(roleIds) || roleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteUserRolesByUser(id, roleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy phân quyền để xóa");

    return buildApiResponse(200, true, "Xóa phân quyền thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
