import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { Searchbar } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TenantRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");

  const route = useRoute();
  const searchResults = route.params?.searchResults;

  const loadRequests = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await axios.get("https://hatien.pythonanywhere.com/room_requests/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dữ liệu từ API:", response.data.results); // Debug API response
      setRequests(response.data.results);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      console.log("Dữ liệu từ tìm kiếm:", searchResults); // Debug dữ liệu tìm kiếm
      setRequests(searchResults);
    } else {
      loadRequests();
    }
  }, [searchResults]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Searchbar
        placeholder="Tìm kiếm bài đăng..."
        value={q}
        onChangeText={setQ}
        style={{ marginBottom: 10 }}
      />

      {loading && <ActivityIndicator size="large" />}
      {requests.length === 0 && !loading && <Text>Không có bài đăng nào.</Text>}

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRequests} />}
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, backgroundColor: "#fff", marginBottom: 10, borderRadius: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
            <Text>Khu vực: {item.preferred_location}</Text>
            <Text>Giá tối đa: {item.price_range} VNĐ</Text>
            <Text>Mô tả: {item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default TenantRequestsScreen;
