import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Divider, Avatar, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://hatien.pythonanywhere.com";

const RequestDetailScreen = ({ route }) => {
  const { item } = route.params || {};
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const userToken = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!userToken) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      let commentsList = [];
      let url = `${API_URL}/comments/?room_request=${item.id}`; // Chỉ lấy bình luận cho listing hiện tại

      // Lặp qua các trang nếu API trả về thuộc tính next
      while (url) {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`, // Thêm token vào header
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}. Lỗi: ${errorText}`);
        }

        const data = await response.json();
        commentsList = commentsList.concat(data.results); // Kết hợp các bình luận từ các trang
        url = data.next; // Cập nhật URL nếu có trang tiếp theo
      }

      // Lấy thông tin người dùng cho mỗi comment dựa trên user.id
      const updatedComments = await Promise.all(
        commentsList.map(async (comment) => {
          const userResponse = await fetch(`${API_URL}/users/${comment.user}/get-user-by-id/`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${userToken}`, // Thêm token vào header khi lấy thông tin người dùng
            },
          });
          if (!userResponse.ok) {
            throw new Error("Lỗi khi lấy thông tin người dùng");
          }
          const userData = await userResponse.json();
          return {
            ...comment,
            user: userData, // Gắn thông tin người dùng vào comment
          };
        })
      );
       // Sắp xếp các bình luận theo thời gian tạo (giả sử comment có trường created_at)
       updatedComments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setComments(updatedComments); // Cập nhật tất cả các bình luận
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
      setError("Không thể tải bình luận. Vui lòng thử lại sau!");
    }
  };

  const handleAddComment = async () => {
    if (comment.trim() === "") return;

    try {
      const userToken = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!userToken) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      // Lấy thông tin người dùng từ token
      const userInfo = await getUserInfoFromToken(userToken);

      const response = await fetch(`${API_URL}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // Thêm token vào header
        },
        body: JSON.stringify({
          content: comment,
          room_request: item.id,
          user: userInfo.id, // Thêm ID người dùng vào payload
        }),
      });

      const responseBody = await response.json();
      console.log('Response status:', response.status);
      console.log('Response body:', responseBody);

      if (!response.ok) {
        throw new Error("Không thể thêm bình luận.");
      }

      if (responseBody.id) {
        // Nếu bình luận được thêm thành công, cập nhật lại danh sách bình luận
        const newComment = {
          ...responseBody,
          user: userInfo, // Thêm thông tin người dùng vào bình luận mới
        };

        setComments((prevComments) => [newComment, ...prevComments]); // Thêm bình luận mới vào đầu danh sách
        setComment(""); // Reset ô nhập bình luận
      } else {
        throw new Error("Dữ liệu phản hồi không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const userToken = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!userToken) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      const response = await fetch(`${API_URL}/comments/${commentId}/delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        throw new Error("Không thể xóa bình luận.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      Alert.alert("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại!");
    }
  };

  const sanitizeDescription = (description) => {
    return description.replace(/<\/?[^>]+(>|$)/g, ""); 
  };

  // Hàm lấy thông tin người dùng từ token
  const getUserInfoFromToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/current-user/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi khi lấy thông tin người dùng. ${errorText}`);
      }

      const data = await response.json();
      return data; // Giả sử API trả về thông tin người dùng
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  };

  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.noInfoText}>Không có thông tin chi tiết.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{item.title}</Title>
          <Paragraph style={styles.info}>📍 Khu vực: {item.preferred_location}</Paragraph>
          <Paragraph style={styles.price}>💰 Giá: {item.price_range} VNĐ</Paragraph>
          <Paragraph style={styles.description}>{item.description}</Paragraph>
        </Card.Content>
      </Card>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>💬 Bình luận:</Text>
        <Divider style={styles.divider} />
        {comments.length === 0 ? (
          <Text style={styles.noCommentText}>Chưa có bình luận.</Text>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Avatar.Image size={40} source={{ uri: comment.user.avatar || "https://www.example.com/default-avatar.png" }} style={styles.avatar} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{comment.user.username}</Text>
                <Text style={styles.commentText}>{comment.content.replace(/<[^>]*>/g, "")}</Text>
              </View>
              <IconButton icon="delete" color="red" size={20} onPress={() => handleDeleteComment(comment.id)} />
            </View>
          ))
        )}
        <TextInput style={styles.commentInput} placeholder="Viết bình luận..." value={comment} onChangeText={setComment} />
        <Button mode="contained" onPress={handleAddComment} style={styles.commentButton}>
          Gửi bình luận
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },
  card: { marginBottom: 20, borderRadius: 10, elevation: 5, backgroundColor: "white" },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 10, color: "#333" },
  info: { fontSize: 16, color: "#555", marginBottom: 5 },
  price: { fontSize: 16, color: "#27ae60", fontWeight: "bold", marginBottom: 5 },
  description: { fontSize: 14, color: "#666", marginBottom: 10 },
  errorText: { color: "red", fontSize: 16, marginTop: 10, textAlign: "center" },
  commentSection: { marginTop: 20 },
  commentTitle: { fontSize: 18, fontWeight: "bold" },
  divider: { marginVertical: 10 },
  noCommentText: { color: "#888", textAlign: "center" },
  commentItem: { flexDirection: "row", marginVertical: 10, alignItems: "center" },
  avatar: { marginRight: 10 },
  commentContent: { flex: 1 },
  commentUsername: { fontSize: 16, fontWeight: "bold" },
  commentText: { fontSize: 14, color: "#444" },
  commentInput: { marginTop: 15, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, backgroundColor: "white" },
  commentButton: { marginTop: 15, backgroundColor: "#FF6347", marginBottom: 30, },
});

export default RequestDetailScreen;
