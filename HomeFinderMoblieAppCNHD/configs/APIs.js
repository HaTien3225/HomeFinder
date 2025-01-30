import axios from "axios";

const BASE_URL = 'https://hatien.pythonanywhere.com/';

export const endpoints = {
    // API đăng ký người dùng mới
    'users-create': '/users/',

    // API lấy thông tin người dùng hiện tại
    'users-get-user': '/users/current-user/',

    // API cập nhật thông tin người dùng
    'users-update-profile': '/users/update-profile/',

    // API xóa người dùng
    'users-delete': (userId) => `/users/${userId}/delete/`,

    // API đăng nhập người dùng (OAuth2)
    'users-login': '/o/token/',

    // API lấy danh sách các phòng chat
    'chats-list': '/chats/',

    // API tạo một phòng chat mới
    'chats-create': '/chats/',

    // API lấy lịch sử chat
    'chats-chat-history': '/chats/history/',

    // API xóa một phòng chat
    'chats-delete-chat': (chatId) => `/chats/${chatId}/delete/`,

    // API lấy danh sách các bình luận
    'comments-list': '/comments/',

    // API tạo một bình luận
    'comments-create': '/comments/',

    // API xóa một bình luận
    'comments-delete-comment': (commentId) => `/comments/${commentId}/delete/`,

    // API cập nhật một bình luận
    'comments-update-comment': (commentId) => `/comments/${commentId}/update/`,

    // API lấy danh sách các follow
    'follow-list': '/follow/',

    // API tạo một follow mới
    'follow-create': '/follow/',

    // API lấy danh sách các bài đăng (listing)
    'listings-list': '/listings/',

    // API tạo một bài đăng mới
    'listings-create': '/listings/',

    // API lấy danh sách các bình luận của một bài đăng
    'listings-get-comment': (listingId) => `/listings/${listingId}/comments/`,

    // API xóa một bài đăng
    'listings-delete-listing': (listingId) => `/listings/${listingId}/delete/`,

    // API yêu thích một bài đăng
    'listings-favorite-listing': (listingId) => `/listings/${listingId}/favorite/`,

    // API báo cáo một bài đăng
    'listings-report-listing': (listingId) => `/listings/${listingId}/report/`,

    // API lấy danh sách thông báo
    'notifications-list': '/notifications/',

    // API đánh dấu thông báo là đã đọc
    'notifications-mark-as-read': (notificationId) => `/notifications/${notificationId}/mark-read/`,

    // API lấy danh sách các yêu cầu phòng trọ
    'room-requests-list': '/room_requests/',

    // API tạo một yêu cầu phòng trọ mới
    'room-requests-create': '/room_requests/',

    // API hủy một yêu cầu phòng trọ
    'room-requests-cancel-request': (roomRequestId) => `/room_requests/${roomRequestId}/cancel/`,

    // API lấy danh sách thống kê
    'statistics-list': '/statistics/',

    // API lấy thống kê theo khu vực
    'statistics-location-statistics': '/statistics/location-statistics/',
};

// Hàm để tạo instance với token cho các API yêu cầu xác thực
export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

// Default axios instance không có authorization token
export default axios.create({
    baseURL: BASE_URL
});
