import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, RefreshControl, Alert, StyleSheet, Text, Button } from "react-native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TenantRequestItem from "./TenantRequestItem";

const TenantRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1); // Current page number
  const [hasMore, setHasMore] = useState(true); // Check if more data is available

  // Hàm tải danh sách phòng trọ
  const loadRequests = async () => {
    if (!loading && page > 0) {
      setLoading(true);
      try {
        let url = `https://hatien.pythonanywhere.com/room_requests/?page=${page}`; // Default URL

        // Add search query to the URL if there's a search term
        if (q) {
          url += `&q=${q}`;
        }

        console.log("Loading from URL:", url); // Debug URL
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (page > 1) {
          setRequests((prevRequests) => [...prevRequests, ...res.data.results]);
        } else {
          setRequests(res.data.results);
        }

        if (!res.data.next) {
          setHasMore(false); // No more data to load
        }
      } catch (error) {
        console.error("Error loading requests:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách yêu cầu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => loadRequests(), 500); 
        return () => clearTimeout(timer);
     // Load requests when the component mounts or page/search query changes
  }, [q, page]);

  // Hàm tìm kiếm khi người dùng thay đổi giá trị
  const handleSearch = (value) => {
    setPage(1); // Reset page to 1 when searching
    setHasMore(true); // Reset hasMore to true for new search
    setQ(value); // Set search query
  };

  // Hàm refresh danh sách
  const refresh = () => {
    setPage(1); // Reset page to 1 when refreshing
    setRefreshing(true); // Set refreshing to true
    loadRequests();
  };

  // Hàm tải thêm phòng trọ khi cuộn xuống
  const loadMore = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Load next page when user reaches the end
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Tìm kiếm bài đăng..."
        value={q}
        onChangeText={handleSearch}
        style={styles.searchbar}
      />

      {loading && <ActivityIndicator size="large" />}
      {requests.length === 0 && !loading && <Text style={styles.noData}>Không có bài đăng nào.</Text>}

      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        data={requests}
        keyExtractor={(item, index) => `${item.id}-${index}`} // Sử dụng id và index kết hợp làm key
        renderItem={({ item }) => <TenantRequestItem item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5} // Trigger loadMore when reaching 50% from the bottom
        ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null} // Show loading indicator at the bottom
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f8f8" },
  searchbar: { marginBottom: 10 },
  noData: { textAlign: "center", fontSize: 16, marginTop: 20, color: "#888" },
});

export default TenantRequestsScreen;
