import { getSectionsInDateRange } from "@/service/sections-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { dateRange } = params;
    
    if (!dateRange || dateRange.length !== 2)
      return buildApiResponse(400, false, "Thiếu khoảng thời gian.");
    const [firstDate, secondDate] = dateRange;
    const startDate = firstDate < secondDate ? firstDate : secondDate;
    const endDate = firstDate > secondDate ? firstDate : secondDate;

    const { searchParams } = new URL(request.url);
    const result = await getSectionsInDateRange(
      searchParams,
      startDate,
      endDate
    );
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách lộ trình thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
