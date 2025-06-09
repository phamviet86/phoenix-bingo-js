import { createEnrollmentsByClass } from "@/service/enrollments-service";
import { buildApiResponse } from "@/lib/util/response-util";

export async function POST(request) {
  try {
    const { typeId, userId, sectionData } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (
      !typeId ||
      !userId ||
      !Array.isArray(sectionData) ||
      sectionData.length === 0
    )
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const result = await createEnrollmentsByClass(typeId, userId, sectionData);

    if (!result || !result.length)
      return buildApiResponse(404, false, "Không thể thêm đăng ký.");

    return buildApiResponse(201, true, "Thêm đăng ký thành công", {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
