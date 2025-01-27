import axios from "axios";

const BASE_URL = 'https://hatien.pythonanywhere.com/';

export const endpoints = {
      // API lấy danh sách các danh mục phòng trọ (ví dụ: khu vực, loại phòng, v.v.)
    'categories': '/categories/',

    // API lấy danh sách các phòng trọ
    'rooms': '/rooms/',

    // API lấy danh sách các bài đăng của chủ nhà trọ
    'listings': '/listings/',

    // API lấy chi tiết phòng trọ
    'room-details': (roomId) => `/rooms/${roomId}/`,

    // API lấy bình luận của phòng trọ
    'comments': (roomId) => `/rooms/${roomId}/comments/`,

    // API cho việc đăng ký người dùng
    'register': '/users/register/',

    // API cho việc đăng nhập người dùng (OAuth2)
    'login': '/o/token/',

    // API lấy thông tin người dùng hiện tại
    'current-user': '/users/current-user/',

    // API để cập nhật thông tin người dùng
    'update-profile': '/users/update-profile/',

    // API để tạo bài đăng cho thuê phòng của chủ nhà trọ
    'create-listing': '/landlord/listings/create/',

    // API để tìm kiếm phòng trọ theo các tiêu chí
    'search-rooms': '/rooms/search/'
}

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});