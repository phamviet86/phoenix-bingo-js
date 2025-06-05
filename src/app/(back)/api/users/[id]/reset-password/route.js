import { changeUserPassword } from "@/service/users-service";
import { buildApiResponse } from "@/lib/util/response-util";
import { hashPassword } from "@/lib/util/bcrypt-util";

export async function PUT(_, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID người dùng.");

    const user_password = await hashPassword(
      process.env.DEFAULT_USER_PASSWORD || "12345678"
    );

    const result = await changeUserPassword(id, user_password);

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
