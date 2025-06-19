import { getSectionSummary } from "@/service/sections-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { dateRange } = params;
    if (!dateRange || dateRange.length < 2)
      return buildApiResponse(400, false, "Thiếu khoảng thời gian.");

    const [startDate, endDate] = dateRange
      .map(decodeURIComponent)
      .map(Date.parse)
      .sort((a, b) => a - b)
      .map((ts) => new Date(ts).toISOString());

    const { searchParams } = new URL(request.url);
    const result = await getSectionSummary(searchParams, startDate, endDate);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lộ trình thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
