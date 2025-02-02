export default MyUserReducers = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null;
        case 'update_user':
            return {
                ...currentState,  // Thay vì state, dùng currentState
                email: action.payload.email,
                username: action.payload.username,
                role: action.payload.role,
                phone_number: action.payload.phone_number,
                address: action.payload.address,
                images: action.payload.images, // Cập nhật ảnh
            };
        default:
            return currentState;
    }
}
