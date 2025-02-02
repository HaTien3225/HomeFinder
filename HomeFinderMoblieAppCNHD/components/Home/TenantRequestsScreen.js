import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator, RefreshControl, Button } from "react-native";
import { Searchbar } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import APIs from "../../configs/APIs"; 
import MyStyles from "../../styles/MyStyles";

const TenantRequestsScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [q, setQ] = useState("");

    const route = useRoute();

    const loadRequests = async () => {
        setLoading(true);
        try {
            let url = `https://hatien.pythonanywhere.com/tenant-requests/`;
            if (q) url += `?q=${q}`;

            console.log("Loading requests from URL:", url);
            const res = await APIs.get(url);
            console.log("Dữ liệu từ API:", res.data);
            setRequests(res.data.results);
        } catch (error) {
            console.error("Lỗi tải danh sách:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [q]);

    // Cập nhật danh sách khi có `refresh`
    useEffect(() => {
        if (route.params?.refresh) {
            loadRequests();
             // Xóa params để tránh load lại liên tục
             navigation.setParams({ refresh: false });
        }
    }, [route.params?.refresh]);

    const refresh = () => {
        setRefreshing(true);
        loadRequests().then(() => setRefreshing(false));
    };

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <Searchbar
                placeholder="Tìm bài đăng..."
                value={q}
                onChangeText={setQ}
                style={{ marginBottom: 10 }}
            />

            {loading && <ActivityIndicator size="large" />}
            {requests.length === 0 && !loading && <Text>Không có bài đăng nào.</Text>}

            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={MyStyles.card}>
                        <Text style={MyStyles.title}>{item.title}</Text>
                        <Text style={MyStyles.text}>Khu vực: {item.preferred_location}</Text>
                        <Text style={MyStyles.text}>Giá tối đa: {item.price_range} VNĐ</Text>
                        <Text style={MyStyles.text}>Mô tả: {item.description}</Text>
                    </View>
                )}
            />
            <Button title="Đăng tin tìm phòng" onPress={() => navigation.navigate("PostNotification")} />
        </View>
    );
};

export default TenantRequestsScreen;
