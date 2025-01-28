import axios from "axios";

const BASE_URL = 'https://hatien.pythonanywhere.com/';

export const endpoints = {
     // API danh mục (các category như loại phòng hoặc khu vực)
    'categories': '/categories/',

    // API danh sách bài đăng phòng trọ
    'listings': '/listings/',

    // API chi tiết bài đăng
    'listing-details': (listingId) => `/listings/${listingId}/`,

    // API bình luận theo bài đăng
    'listing-comments': (listingId) => `/listings/${listingId}/comments/`,

    // API yêu cầu phòng trọ (cho tenant gửi yêu cầu tìm phòng)
    'room-requests': '/room-requests/',
    'room-request-details': (requestId) => `/room-requests/${requestId}/`,

    // API bình luận liên quan đến yêu cầu phòng trọ
    'room-request-comments': (requestId) => `/room-requests/${requestId}/comments/`,

    // API đăng ký người dùng mới
    'register': '/users/register/',

    // API đăng nhập người dùng
    'login': '/o/token/',

    // API lấy thông tin người dùng hiện tại
    'current-user': '/users/current-user/',

    // API cập nhật hồ sơ người dùng
    'update-profile': '/users/update-profile/',

    // API danh sách bài đăng của chủ nhà trọ
    'landlord-listings': '/landlord/listings/',

    // API tạo bài đăng mới (dành cho host)
    'create-listing': '/landlord/listings/create/',

    // API tìm kiếm phòng trọ
    'search-listings': '/listings/search/',

    // API thông báo
    'notifications': '/notifications/',

    // API hệ thống chat
    'chat': (userId) => `/chats/${userId}/`,

    // API thống kê
    'statistics': '/statistics/',
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