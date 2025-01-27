import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Card, List } from "react-native-paper";
import RenderHTML from "react-native-render-html";
import APIs, { endpoints } from "../../configs/APIs";
import MyStyles from "../../styles/MyStyles";
import moment from "moment";

const RoomDetails = ({ route }) => {
    const roomId = route.params?.roomId;  // Sử dụng roomId 
    const [room, setRoom] = React.useState(null);  // Khởi tạo state cho phòng trọ
    const [comments, setComments] = React.useState(null);  // Khởi tạo state cho bình luận

    // Hàm tải chi tiết phòng trọ từ API
    const loadRoom = async () => {
        let res = await APIs.get(endpoints['room-details'](roomId));  // Sử dụng roomId để gọi API chi tiết phòng trọ
        setRoom(res.data);
    }

    // Hàm tải bình luận về phòng trọ
    const loadComments = async () => {
        let res = await APIs.get(endpoints['comments'](roomId));  // API bình luận liên quan đến phòng trọ
        setComments(res.data);
    }

    // Load thông tin phòng trọ và bình luận khi component được render
    React.useEffect(() => {
        loadRoom();
        loadComments();
    }, [roomId]);

    const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    const reachBottom = ({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent) && comments === null) {
            loadComments();  // Tải thêm bình luận khi kéo xuống dưới cùng
        }
    }

    return (
        <ScrollView onScroll={reachBottom}>
            {room === null ? <ActivityIndicator size="large" /> : (
                <Card>
                    <Card.Cover source={{ uri: room.image }} />
                    <Card.Content>
                        <Text variant="titleLarge" style={MyStyles.roomTitle}>{room.name}</Text>
                        <Text style={MyStyles.roomDescription}>{room.description}</Text>
                        <Text style={MyStyles.roomPrice}>Giá: {room.price} VNĐ</Text>
                        <Text style={MyStyles.roomLocation}>Địa chỉ: {room.address}</Text>
                        <RenderHTML source={{ html: room.content }} />
                    </Card.Content>
                </Card>
            )}

            <View>
                {comments === null ? <ActivityIndicator size="large" /> : (
                    comments.map(c => (
                        <List.Item
                            key={c.id}
                            title={c.content}
                            description={moment(c.created_date).fromNow()}
                            left={() => <Image style={MyStyles.box} source={{ uri: c.user.image }} />}
                        />
                    ))
                )}
            </View>
        </ScrollView>
    );
}

export default RoomDetails;
