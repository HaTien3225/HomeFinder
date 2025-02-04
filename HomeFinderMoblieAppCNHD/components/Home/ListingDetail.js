import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph, Button, Divider, Avatar, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import * as jwtDecode from "jwt-decode";
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker for Google Maps

const API_URL = "https://hatien.pythonanywhere.com"; // Update the API URL

const ListingDetail = ({ route }) => {
  const { item } = route.params || {};  
  const [comment, setComment] = useState("");  
  const [comments, setComments] = useState([]);  
  const [error, setError] = useState("");  
  const [isFollowing, setIsFollowing] = useState(false);  // Trạng thái theo dõi
  const [hostId, setHostId] = useState(null);  // ID của chủ nhà trọ
  const [followId, setFollowId] = useState(null);  // Lưu ID follow để hủy theo dõi
  const [latitude, setLatitude] = useState(null); // For latitude
  const [longitude, setLongitude] = useState(null); // For longitude


  useEffect(() => {
    if (item) {
      setHostId(item.host?.id);  // Gán ID chủ nhà trọ
      setLatitude(item.latitude); // Gán latitude từ item
      setLongitude(item.longitude); // Gán longitude từ item
     
      fetchComments();
      checkFollowStatus();
    }
  }, [item]);
  
  

  const getUserIdFromToken = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            throw new Error("Token không tồn tại");
        }
        const decoded = jwtDecode(token);
        return decoded?.user_id || null; 
    } catch (error) {
        console.error("Lỗi khi lấy user_id từ token:", error);
        return null;
    }
};

const checkFollowStatus = async () => {
  try {
      const userToken = await AsyncStorage.getItem("token");
      if (!userToken || !hostId) return;

      const api = authApis(userToken);
      const response = await api.get(endpoints['follow-list']);

      if (response.data.results && Array.isArray(response.data.results)) {
          const followData = response.data.results.find(follow => follow.host?.id === hostId);
          if (followData) {
              setIsFollowing(true);
              setFollowId(followData.id);
          } else {
              setIsFollowing(false);
          }
      }
  } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái theo dõi:", error);
  }
};



  
const handleFollow = async () => {
  try {
      const userToken = await AsyncStorage.getItem("token");
      if (!userToken) {
          Alert.alert("Lỗi", "Bạn chưa đăng nhập.");
          return;
      }

      if (!hostId) {
          console.error("Không tìm thấy hostId.");
          return;
      }

      const api = authApis(userToken);
      const response = await api.post(endpoints['follow-create'], { host: hostId });

      if (response.status === 201) {
          setIsFollowing(true);
          setFollowId(response.data.id);
          Alert.alert("Thông báo", "Bạn đã theo dõi chủ nhà!");
          checkFollowStatus(); // Cập nhật lại trạng thái theo dõi
      }
  } catch (error) {
      console.error("Lỗi khi theo dõi:", error);
      Alert.alert("Lỗi", "Không thể theo dõi. Vui lòng thử lại!");
  }
};


const handleUnfollow = async () => {
  try {
      const userToken = await AsyncStorage.getItem("token");
      if (!userToken) {
          Alert.alert("Lỗi", "Bạn chưa đăng nhập.");
          return;
      }

      if (!followId) {
          console.error("Không tìm thấy followId để hủy theo dõi.");
          return;
      }

      const api = authApis(userToken);
      const response = await api.delete(endpoints['comments-delete-comment'](followId));

      if (response.status === 204) {
          setIsFollowing(false);
          setFollowId(null);
          Alert.alert("Thông báo", "Bạn đã hủy theo dõi chủ nhà.");
          checkFollowStatus(); // Cập nhật lại trạng thái theo dõi
      }
  } catch (error) {
      console.error("Lỗi khi hủy theo dõi:", error);
      Alert.alert("Lỗi", "Không thể hủy theo dõi. Vui lòng thử lại.");
  }
};


  

  const fetchComments = async () => {
    try {
      const userToken = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      if (!userToken) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      let commentsList = [];
      let url = `${API_URL}/comments/?listing=${item.id}`; // Chỉ lấy bình luận cho listing hiện tại

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
          throw new Error(`HTTP error! Status: ${response.status}. Error: ${errorText}`);
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

          {/* Nút theo dõi / hủy theo dõi */}
          <Button 
            mode="contained" 
            style={styles.followButton}
            onPress={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Hủy theo dõi" : "Theo dõi"}
          </Button>
        </Card.Content>
      </Card>

       {/* MapView for showing location */}
    {latitude && longitude ? (
      <MapView
        style={styles.map}
        initialRegion={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.commentSection}>
        <Text style={styles.commentTitle}>💬 Bình luận:</Text>
        <Divider style={styles.divider} />
        {comments.length === 0 ? (
          <Text style={styles.noCommentText}>Chưa có bình luận.</Text>
        ) : (
          comments.map((commentItem) => (
            <View key={commentItem.id} style={styles.commentItem}>
              <Avatar.Image 
                size={40} 
                source={{ uri: commentItem.user?.avatar || 'https://www.example.com/default-avatar.png' }} 
                style={styles.avatar} 
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUsername}>
                  {commentItem.user?.username || "Người dùng"}
                </Text>
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
  },
  divider: {
    marginVertical: 10,
  },
  noCommentText: {
    color: "#888",
    textAlign: "center",
  },
  commentItem: {
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center",
  },
  avatar: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 16,
    fontWeight: "bold",
  },
  commentText: {
    fontSize: 14,
    color: "#444",
  },
  commentInput: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "white",
  },
  commentButton: {
    marginTop: 15,
    backgroundColor: "#FF6347",
  },
  map: {
    height: 300,  // Set the height of the map
    marginVertical: 15,
  },
});

export default ListingDetail;
