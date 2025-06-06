import {
  getSectionsByClass,
  createSectionsByClass,
  deleteSectionsByClass,
} from "@/service/sections-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const { searchParams } = new URL(request.url);
    const result = await getSectionsByClass(searchParams, id);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lộ trình thành công", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const { moduleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(moduleIds) || moduleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createSectionsByClass(id, moduleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm lộ trình.");

    return buildApiResponse(201, true, "Thêm lộ trình thành công", {
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
    if (!id) return buildApiResponse(400, false, "Thiếu ID lớp học.");

    const { moduleIds } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!Array.isArray(moduleIds) || moduleIds.length === 0)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await deleteSectionsByClass(id, moduleIds);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không tìm thấy lộ trình để xóa");

    return buildApiResponse(200, true, "Xóa lộ trình thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
