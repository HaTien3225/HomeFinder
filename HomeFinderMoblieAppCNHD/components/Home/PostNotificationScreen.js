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

  const handleSearch = async () => {
    if (!title && !description && !priceRange && !preferredLocation) {
      Alert.alert("Lỗi", "Vui lòng nhập ít nhất một tiêu chí tìm kiếm!");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      let url = `https://hatien.pythonanywhere.com/room_requests/?`;
      if (title) url += `title=${title}&`;
      if (description) url += `description=${description}&`;
      if (priceRange) url += `price_range=${priceRange}&`;
      if (preferredLocation) url += `preferred_location=${preferredLocation}&`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Điều hướng sang màn hình TenantRequestsScreen và truyền kết quả tìm kiếm
      navigation.navigate("TenantRequests", { searchResults: response.data.results });
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải kết quả tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Mô tả" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Khoảng giá" value={priceRange} onChangeText={setPriceRange} />
      <TextInput style={styles.input} placeholder="Vị trí ưu tiên" value={preferredLocation} onChangeText={setPreferredLocation} />
      
      <TouchableOpacity style={styles.button} onPress={handleSearch} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Tìm kiếm</Text>}
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
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default PostNotificationScreen;
