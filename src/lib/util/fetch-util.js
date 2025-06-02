// path: @/lib/util/fetch-util.js

import { buildSearchParams } from "@/lib/util/query-helper";

/**
 * Thực hiện fetch request và xử lý response
 * @param {string} url - URL để gửi request
 * @param {Object} options - Các tùy chọn cho fetch request
 * @returns {Promise<Object>} Promise trả về dữ liệu JSON đã parse
 * @throws {Error} Ném lỗi nếu request không thành công
 */
async function performFetch(url, options) {
  const result = await fetch(url, options);

  if (!result.ok) {
    const errorData = await result.json();
    throw new Error(errorData.message);
  }
  return result.json();
}

/**
 * Lấy danh sách dữ liệu với các tham số tìm kiếm, sắp xếp và lọc
 * @param {string} url - URL API endpoint
 * @param {Object} params - Các tham số tìm kiếm (sẽ được chuyển thành query string)
 * @param {Object} [sort={}] - Đối tượng sắp xếp, ví dụ: { createdAt: 'descend', name: 'ascend' }
 * @param {Object} [filter={}] - Đối tượng lọc, ví dụ: { status: ['active', 'inactive'] }
 * @returns {Promise<Object>} Promise trả về danh sách dữ liệu
 *
 * @example
 * const users = await fetchLIST('/api/users',
 *   { name: 'John', age: '_gt 18' },
 *   { createdAt: 'descend' },
 *   { status: ['active'] }
 * );
 */
export async function fetchLIST(url, params, sort = {}, filter = {}) {
  const searchParams = buildSearchParams(params, sort, filter);
  return performFetch(`${url}?${searchParams}`, { method: "GET" });
}

/**
 * Lấy thông tin chi tiết của một bản ghi theo ID
 * @param {string} url - URL API endpoint
 * @param {string|number} id - ID của bản ghi cần lấy
 * @returns {Promise<Object>} Promise trả về thông tin chi tiết của bản ghi
 *
 * @example
 * const user = await fetchGET('/api/users', 123);
 */
export async function fetchGET(url, id) {
  return performFetch(`${url}/${id}`, { method: "GET" });
}

/**
 * Tạo mới một bản ghi
 * @param {string} url - URL API endpoint
 * @param {Object} [values={}] - Dữ liệu để tạo bản ghi mới
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã tạo
 *
 * @example
 * const newUser = await fetchPOST('/api/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 */
export async function fetchPOST(url, values = {}) {
  return performFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Cập nhật một phần thông tin của bản ghi (partial update)
 * @param {string} url - URL API endpoint
 * @param {Object} [values={}] - Dữ liệu cần cập nhật (chỉ các trường thay đổi)
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã cập nhật
 *
 * @example
 * const updatedUser = await fetchPATCH('/api/users/123', {
 *   name: 'John Smith'
 * });
 */
export async function fetchPATCH(url, values = {}) {
  return performFetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Cập nhật toàn bộ thông tin của bản ghi theo ID
 * @param {string} url - URL API endpoint
 * @param {string|number} id - ID của bản ghi cần cập nhật
 * @param {Object} [values={}] - Dữ liệu để thay thế toàn bộ bản ghi
 * @returns {Promise<Object>} Promise trả về thông tin bản ghi đã cập nhật
 *
 * @example
 * const updatedUser = await fetchPUT('/api/users', 123, {
 *   name: 'John Smith',
 *   email: 'johnsmith@example.com',
 *   status: 'active'
 * });
 */
export async function fetchPUT(url, id, values = {}) {
  return performFetch(`${url}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
}

/**
 * Xóa một bản ghi theo ID
 * @param {string} url - URL API endpoint
 * @param {string|number} id - ID của bản ghi cần xóa
 * @returns {Promise<Object>} Promise trả về kết quả xóa
 *
 * @example
 * const result = await fetchDELETE('/api/users', 123);
 */
export async function fetchDELETE(url, id) {
  return performFetch(`${url}/${id}`, { method: "DELETE" });
}
