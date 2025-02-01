import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Divider, Avatar, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const API_URL = "https://hatien.pythonanywhere.com"; // Update the API URL

const ListingDetail = ({ route }) => {
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

      const response = await fetch(`${API_URL}/comments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`, // Thêm token vào header
        },
      });

      if (!response.ok) {
        const errorText = await response.text(); // Log more detailed error
        throw new Error(`HTTP error! Status: ${response.status}. Error: ${errorText}`);
      }

      const data = await response.json();
      setComments(data.results);
    } catch (error) {
      console.error("Error fetching comments:", error);
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
          listing: item.id,
          user: userInfo.id, // Thêm ID người dùng vào payload
        }),
      });

      // Log response to check
      console.log('Response status:', response.status);
      console.log('Response body:', await response.text());

      if (!response.ok) {
        throw new Error("Failed to add comment.");
      }

      const data = await response.json();
      if (data.id) {
        setComments([...comments, data]);
        setComment(""); // Reset the comment input
      } else {
        throw new Error("Invalid response data.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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
        throw new Error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      Alert.alert("Lỗi", "Không thể xóa bình luận. Vui lòng thử lại!");
    }
  };

  const sanitizeDescription = (description) => {
    return description.replace(/<\/?[^>]+(>|$)/g, ""); 
  };

  // Hàm lấy thông tin người dùng từ token
  const getUserInfoFromToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/user-info/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user info. ${errorText}`);
      }

      const data = await response.json();
      return data; // Giả sử API trả về thông tin người dùng
    } catch (error) {
      console.error("Error fetching user info:", error);
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
        <Card.Cover source={{ uri: item.image }} style={styles.image} />
        <Card.Content>
          <Title style={styles.title}>{item.title}</Title>
          <Paragraph style={styles.price}>💰 {item.price} VND</Paragraph>
          <Paragraph style={styles.address}>📍 {item.address}</Paragraph>
          <Paragraph style={styles.host}>👤 Chủ nhà: {item.host?.username}</Paragraph>
          <Paragraph style={styles.description}>📝 {sanitizeDescription(item.description)}</Paragraph>
        </Card.Content>
      </Card>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>💬 Bình luận:</Text>
        <Divider style={styles.divider} />
        {comments.length === 0 ? (
          <Text style={styles.noCommentText}>Chưa có bình luận.</Text>
        ) : (
          comments.map((commentItem) => (
            <View key={commentItem.id} style={styles.commentItem}>
              <Avatar.Image size={40} source={{ uri: commentItem.user.avatar }} />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>{commentItem.user.username}</Text>
                <Text style={styles.commentText}>
                  {commentItem.content ? commentItem.content.replace(/<\/?[^>]+(>|$)/g, "") : "Nội dung bình luận không có sẵn."}
                </Text>
              </View>
              <IconButton icon="delete" size={20} onPress={() => handleDeleteComment(commentItem.id)} />
            </View>
          ))
        )}

        <TextInput
          style={styles.commentInput}
          placeholder="Viết bình luận..."
          value={comment}
          onChangeText={setComment}
        />
        <Button mode="contained" onPress={handleAddComment} style={styles.commentButton}>
          Gửi bình luận
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  noInfoText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "white",
  },
  image: {
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  price: {
    fontSize: 18,
    color: "#FF6347",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  host: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  commentSection: {
    marginTop: 20,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  divider: {
    marginBottom: 10,
  },
  noCommentText: {
    fontSize: 16,
    color: "#888",
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentText: {
    fontSize: 16,
    color: "#333",
  },
  commentInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  commentButton: {
    backgroundColor: "#FF6347",
  },
});

export default ListingDetail;
