import { View, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Searchbar } from "react-native-paper";
import RoomItem from "./RoomItem"; // Đảm bảo tên file và import đúng
import RoomItem from '../components/RoomItem'; // Nếu RoomItem.js ở thư mục con

const Home = () => {
    const [categories, setCategories] = React.useState([]);  // Danh mục các loại phòng trọ
    const [rooms, setRooms] = React.useState([]);  // Danh sách phòng trọ
    const [loading, setLoading] = React.useState(false);  // Trạng thái loading
    const [cateId, setCateId] = React.useState("");  // ID danh mục chọn
    const [page, setPage] = React.useState(1);  // Trang hiện tại
    const [q, setQ] = React.useState("");  // Từ khóa tìm kiếm

    // Tải danh mục phòng trọ (ví dụ: phòng trọ sinh viên, phòng trọ giá rẻ...)
    const loadCates = async () => {
        try {
            let res = await APIs.get(endpoints['categories']);
            setCategories(res.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    // Tải danh sách phòng trọ theo các bộ lọc
    const loadRooms = async () => {
        if (page > 0) {
            setLoading(true);

            try {
                let url = `${endpoints['rooms']}?page=${page}`;
                if (cateId || q) 
                    url += `&category_id=${cateId}&q=${q}`;

                let res = await APIs.get(url);
                if (page > 1) 
                    setRooms((prevRooms) => [...prevRooms, ...res.data.results]);
                else 
                    setRooms(res.data.results);

                if (!res.data.next) 
                    setPage(0);
            } catch (ex) {
                console.error("Error loading rooms:", ex);
            } finally {
                setLoading(false);
            }
        }
    };

    // Tải lại dữ liệu khi các tham số thay đổi (category, page, search)
    React.useEffect(() => {
        loadCates();
    }, []);

    React.useEffect(() => {
        let timer = setTimeout(() => loadRooms(), 500);
        return () => clearTimeout(timer);
    }, [cateId, page, q]);

    // Tải thêm dữ liệu khi người dùng kéo xuống
    const loadMore = () => {
        if (page > 0 && !loading) 
            setPage((prevPage) => prevPage + 1);
    };

    // Chức năng tìm kiếm theo từ khóa hoặc danh mục
    const search = (value, callback) => {
        setPage(1);
        callback(value);
    };

    // Refresh lại dữ liệu
    const refresh = () => {
        setPage(1);
        loadRooms();
    };

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <View style={MyStyles.row}>
                <TouchableOpacity onPress={() => search("", setCateId)}>
                    <Chip style={MyStyles.margin} icon="label">Tất cả</Chip>
                </TouchableOpacity>
                {categories.map((c) => (
                    <TouchableOpacity onPress={() => search(c.id, setCateId)} key={c.id}>
                        <Chip style={MyStyles.margin} icon="label">{c.name}</Chip>
                    </TouchableOpacity>
                ))}
            </View>
            
            {loading && <ActivityIndicator />}

            <Searchbar 
                placeholder="Tìm phòng trọ..." 
                value={q} 
                onChangeText={(t) => search(t, setQ)} 
            />

            <FlatList 
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                onEndReached={loadMore} 
                onEndReachedThreshold={0.5} // Đảm bảo gọi loadMore khi gần cuối
                data={rooms} 
                keyExtractor={(item) => item.id.toString()} // Dùng keyExtractor thay vì key trong renderItem
                renderItem={({ item }) => (
                    <RoomItem 
                        item={item} 
                        routeName="roomDetail" 
                        params={{ roomId: item.id }} 
                    />
                )}
            />
        </View> 
    );
};

export default Home;
