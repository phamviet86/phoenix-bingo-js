import { getRoles, createRole } from "@/service/roles-service";
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
    const { role_name, role_path, role_color } = await request.json();

    const data = {
      role_name,
      role_path,
      role_color,
    };

    const result = await createRole(data);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(201, true, "Tạo vai trò thành công.", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
