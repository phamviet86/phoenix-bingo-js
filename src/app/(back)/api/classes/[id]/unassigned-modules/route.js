import { getModulesNotInClass } from "@/service/modules-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const { searchParams } = new URL(request.url);

    const result = await getModulesNotInClass(searchParams, id);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách học phần thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
