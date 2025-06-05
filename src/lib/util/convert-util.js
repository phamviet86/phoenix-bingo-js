// path: @/lib/util/convert-util.js

const FILE_ID_REGEX = /\/d\/([a-zA-Z0-9_-]+)\//;
const GOOGLE_DRIVE_REGEX =
  /https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\//;

/**
 * @description Convert a Google Drive image link to a direct link with specified size.
 *
 * @param {string} link - The Google Drive image link.
 * @param {number} size - The desired image size.
 * @returns {string|null} - The converted image link or the original link if invalid.
 */
export function convertGoogleImage(link, size = 800) {
  if (!link) {
    console.error("Thiếu liên kết để chuyển đổi hình ảnh");
    return null;
  }

  if (!GOOGLE_DRIVE_REGEX.test(link)) {
    return link;
  }

  const match = link.match(FILE_ID_REGEX);
  const fileId = match ? match[1] : null;

  return fileId
    ? `https://lh3.googleusercontent.com/d/${fileId}=w${size}`
    : null;
}

/**
 * Tạo cả dữ liệu enum và options từ một mảng đối tượng, có thể lọc theo các tham số
 *
 * @param {Array<Object>} data - Mảng dữ liệu cần xử lý
 * @param {Object} columnConfig - Cấu hình các cột
 * @param {string} columnConfig.value - Tên thuộc tính sử dụng làm khóa/giá trị
 * @param {string} columnConfig.label - Tên thuộc tính sử dụng làm văn bản hiển thị
 * @param {string} [columnConfig.color] - Tên thuộc tính tùy chọn cho thông tin màu sắc/trạng thái
 * @param {string} [columnConfig.group] - Tên thuộc tính tùy chọn để nhóm options
 * @param {Object} [filterParams={}] - Tham số lọc tùy chọn (cặp field:value)
 * @returns {Object} Object chứa cả enum và options { enums: Object, options: Array }
 */
export function setSelection(data, columnConfig, filterParams = {}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { enums: {}, options: [] };
  }

  // Lọc dữ liệu nếu có tham số
  let filteredData = data;
  if (filterParams && Object.keys(filterParams).length > 0) {
    filteredData = data.filter((item) => {
      // Kiểm tra tất cả tham số có khớp không
      return Object.entries(filterParams).every(([key, paramValue]) => {
        return item[key] === paramValue;
      });
    });
  }

  // Tạo enum từ dữ liệu đã lọc
  const enums = filteredData.reduce((accumulator, item) => {
    if (item && item[columnConfig.value] !== undefined) {
      accumulator[item[columnConfig.value]] = {
        text: item[columnConfig.label],
        color: columnConfig.color ? item[columnConfig.color] ?? null : null,
        status: columnConfig.color ? item[columnConfig.color] ?? null : null,
      };
    }
    return accumulator;
  }, {});

  // Tạo options từ dữ liệu đã lọc
  let options = [];

  // Nếu không có group, trả về mảng options đơn giản
  if (!columnConfig.group) {
    options = filteredData
      .filter((item) => item && item[columnConfig.value] !== undefined)
      .map((item) => ({
        value: item[columnConfig.value],
        label: item[columnConfig.label],
      }));
  } else {
    // Nhóm dữ liệu theo trường được chỉ định
    const groupedData = filteredData.reduce((acc, item) => {
      if (!item || item[columnConfig.value] === undefined) return acc;

      const groupValue = item[columnConfig.group] || "Ungrouped"; // Sử dụng "Ungrouped" làm nhóm mặc định

      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }

      acc[groupValue].push({
        value: item[columnConfig.value],
        label: item[columnConfig.label],
      });

      return acc;
    }, {});

    // Chuyển đổi sang định dạng options nhóm của Ant Design
    options = Object.keys(groupedData).map((key) => ({
      label: key,
      key: key, // Sử dụng làm React key
      options: groupedData[key],
    }));
  }

  return {
    enums,
    options,
  };
}

/**
 * Helper function to generate ISO formatted event times and display time
 * @param {string} isoDateString - ISO date string (e.g. "2025-04-25T00:00:00.000Z")
 * @param {string} timeString - Time string in format "HH:MM:SS" (e.g. "19:30:00")
 * @returns {Object} Object containing ISO datetime string and display time
 */
function generateEventTime(isoDateString, timeString) {
  if (!isoDateString || !timeString)
    return { eventTime: null, displayTime: null };

  try {
    // Parse hours and minutes from time string
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Create date from ISO string
    const baseDate = new Date(isoDateString);

    // Get date components
    const year = baseDate.getFullYear();
    const month = String(baseDate.getMonth() + 1).padStart(2, "0");
    const day = String(baseDate.getDate()).padStart(2, "0");

    // Format time components
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    // Build result strings
    const eventTime = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00`;
    const displayTime = `${formattedHours}:${formattedMinutes}`;

    return { eventTime, displayTime };
  } catch (error) {
    console.error("Error generating event time:", error);
    return { eventTime: null, displayTime: null };
  }
}

/**
 * Converts schedule data to FullCalendar event format
 * @param {Array} data - Array of schedule objects
 * @returns {Array} - Array of events formatted for FullCalendar
 */
export function convertEvents(data = []) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((item) => {
    const { eventTime: startTime, displayTime: startDisplayTime } =
      generateEventTime(item.schedule_date, item.shift_start_time);
    const { eventTime: endTime, displayTime: endDisplayTime } =
      generateEventTime(item.schedule_date, item.shift_end_time);

    return {
      id: item.id,
      title: `${item.class_name} ${item.module_name}`,
      start: startTime,
      end: endTime,
      extendedProps: {
        id: item.id,
        updated_at: item.updated_at || null,
        section_id: item.section_id || null,
        lesson_id: item.lesson_id || null,
        shift_id: item.shift_id || null,
        room_id: item.room_id || null,
        schedule_date: item.schedule_date || null,
        schedule_status_id: item.schedule_status_id || null,
        schedule_status_color: item.schedule_status_color || null,
        schedule_desc: item.schedule_desc || null,
        shift_start_time: item.shift_start_time || null,
        shift_end_time: item.shift_end_time || null,
        shift_name: item.shift_name || null,
        class_name: item.class_name || null,
        class_code: item.class_code || null,
        room_name: item.room_name || null,
        module_name: item.module_name || null,
        lesson_name: item.lesson_name || null,
      },
    };
  });
}

/**
 * Converts an array of objects into a format suitable for transfer components.
 *
 * @param {Array<Object>} data - The input array of items to convert.
 * @param {Object} options - The mapping options for keys in the output.
 * @param {string} options.key - The property name to use as the unique key for each item.
 * @param {string} options.title - The property name to use as the title for each item.
 * @param {string} options.description - The property name to use as the description for each item.
 * @param {string} options.disabled - The property name to determine if the item is disabled.
 * @returns {Array<Object>} The converted array of items with keys: key, title, description, and disabled.
 *
 * @example
 * const data = [
 *   { id: 1, name: 'Item 1', desc: 'First item', isDisabled: false },
 *   { id: 2, name: 'Item 2', desc: 'Second item', isDisabled: true }
 * ];
 * const options = { key: 'id', title: 'name', description: 'desc', disabled: 'isDisabled' };
 * const result = convertTransferItems(data, options);
 * // result:
 * // [
 * //   { key: 1, title: 'Item 1', description: 'First item', disabled: false },
 * //   { key: 2, title: 'Item 2', description: 'Second item', disabled: true }
 * // ]
 */
export function convertTransferItems(
  data = [],
  { key, title, description, disabled } = {}
) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.map((item) => ({
    key: item[key] || item.id,
    title: item[title],
    description: item[description],
    disabled: item[disabled],
  }));
}
