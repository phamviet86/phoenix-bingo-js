import { getRooms, createRoom, updateRoom } from "@/service/rooms-service";
import { buildApiResponse, handleData } from "@/lib/util/response-util";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getRooms(searchParams);
    const { data, total } = handleData(result);
    return buildApiResponse(200, true, "Lấy danh sách phòng học thành công", {
      data,
      total,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}

export async function POST(request) {
  try {
    const { id = null, room_name, room_desc = null } = await request.json();

    // Validate required fields (based on NOT NULL constraints in SQL)
    if (!room_name)
      return buildApiResponse(400, false, "Thiếu thông tin bắt buộc");

    const data = {
      room_name,
      room_desc,
    };

    let result;
    let message;
    let statusCode;

    if (id !== null) {
      // Update existing room
      result = await updateRoom(data, id);
      message = "Cập nhật phòng học thành công.";
      statusCode = 200;
    } else {
      // Create new room
      result = await createRoom(data);
      message = "Tạo phòng học thành công.";
      statusCode = 201;
    }

    if (!result || !result.length)
      return buildApiResponse(500, false, "Không thể thực hiện thao tác.");

    return buildApiResponse(statusCode, true, message, {
      data: result,
    });
  } catch (error) {
    return buildApiResponse(500, false, error.message);
  }
}
