import { ActivityIndicator, ScrollView, Text, View, Image } from "react-native";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../../configs/APIs";
import MyStyles from "../../styles/MyStyles";
import React from 'react';

const Room = ({ route }) => {
    const roomId = route.params?.roomId;  // Lấy roomId từ params
    const [room, setRoom] = React.useState(null);  // Khởi tạo trạng thái phòng trọ

    // Hàm tải chi tiết phòng trọ từ API
    const loadRoom = async () => {
        try {
            let res = await APIs.get(endpoints['room-requests-list'](roomId));  // Gọi API với roomId
            setRoom(res.data);  // Lưu dữ liệu phòng trọ vào state
        } catch (error) {
            console.error("Error loading room details:", error);
        }
    };

    // Load thông tin phòng trọ khi component được render
    React.useEffect(() => {
        loadRoom();  // Gọi API khi roomId thay đổi
    }, [roomId]);

    return (
        <ScrollView style={MyStyles.container}>
            {room === null ? (
                <ActivityIndicator size="large" />  // Hiển thị loading khi chưa có dữ liệu
            ) : (
                <View style={MyStyles.roomDetailsContainer}>
                    {/* Hiển thị ảnh phòng trọ, có thể sử dụng ảnh từ Cloudinary */}
                    <Image source={{ uri: room.image }} style={MyStyles.roomImage} />
                    
                    {/* Tiêu đề phòng trọ */}
                    <Text style={MyStyles.roomTitle}>{room.title}</Text>

                    {/* Mô tả phòng trọ */}
                    <Text style={MyStyles.roomDescription}>{room.description}</Text>

                    {/* Giá phòng trọ */}
                    <Text style={MyStyles.roomPrice}>Giá: {room.price} VNĐ</Text>

                    {/* Địa chỉ phòng trọ */}
                    <Text style={MyStyles.roomLocation}>Địa chỉ: {room.address}</Text>

                    {/* Thông tin về người cho thuê */}
                    <Text style={MyStyles.roomHost}>Chủ nhà: {room.host.username}</Text>
                    
                    {/* Có thể thêm các thông tin khác nếu cần */}
                </View>
            )}
        </ScrollView>
    );
}

export default Room;
