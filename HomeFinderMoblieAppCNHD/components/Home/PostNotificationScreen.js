import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostNotificationScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePostRequest = async () => {
    if (!title.trim() || !description.trim() || !priceRange.trim() || !preferredLocation.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập, vui lòng thử lại.");
        setLoading(false);
        return;
      }

      const requestData = {
        title: title.trim(),
        description: description.trim(),
        price_range: priceRange.trim(),
        preferred_location: preferredLocation.trim(),
      };

      const response = await axios.post("https://hatien.pythonanywhere.com/room_requests/", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        Alert.alert("Thành công", "Tin tìm phòng đã được đăng!");
        navigation.navigate("TenantRequests");;
      }
    } catch (error) {
      console.error("Lỗi khi đăng tin:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.error || "Không thể đăng tin, vui lòng thử lại.";
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Mô tả chi tiết"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Khoảng giá (VD: 2tr-3tr)"
        value={priceRange}
        onChangeText={setPriceRange}
      />
      <TextInput
        style={styles.input}
        placeholder="Vị trí mong muốn"
        value={preferredLocation}
        onChangeText={setPreferredLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handlePostRequest} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng tin</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default PostNotificationScreen;
