import { getUserPassword, changeUserPassword } from "@/service/users-service";
import { buildApiResponse } from "@/lib/util/response-util";
import { hashPassword, comparePassword } from "@/lib/util/bcrypt-util";

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const { oldPassword, newPassword, confirmPassword } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!oldPassword || !newPassword || !confirmPassword)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const currentPasswordResult = await getUserPassword(id);
    if (!currentPasswordResult || !currentPasswordResult.length)
      return buildApiResponse(404, false, "Không tìm thấy người dùng");

    const currentPassword = currentPasswordResult[0].user_password;
    const isPasswordValid = await comparePassword(oldPassword, currentPassword);

    if (!isPasswordValid)
      return buildApiResponse(400, false, "Mật khẩu cũ không chính xác");

    if (newPassword !== confirmPassword)
      return buildApiResponse(400, false, "Mật khẩu mới không khớp");

    const hashedNewPassword = await hashPassword(newPassword);
    const result = await changeUserPassword(id, hashedNewPassword);

    if (!result || !result.length)
      return buildApiResponse(
        404,
        false,
        "Không tìm thấy người dùng hoặc người dùng đã bị xóa."
      );

    return buildApiResponse(200, true, "Đặt lại mật khẩu thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
