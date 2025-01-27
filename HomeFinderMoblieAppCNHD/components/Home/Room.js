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
            let res = await APIs.get(endpoints['room'](roomId));  // Sử dụng roomId để gọi API đúng
            setRoom(res.data);  // Lưu dữ liệu phòng trọ vào state
        } catch (error) {
            console.error(error);
        }
    }

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
                    <Image source={{ uri: room.image }} style={MyStyles.roomImage} />
                    <Text style={MyStyles.roomTitle}>{room.name}</Text>
                    <Text style={MyStyles.roomDescription}>{room.description}</Text>
                    <Text style={MyStyles.roomPrice}>Giá: {room.price} VNĐ</Text>
                    <Text style={MyStyles.roomLocation}>Địa chỉ: {room.address}</Text>
                </View>
            )}
        </ScrollView>
    );
}

export default Room;
