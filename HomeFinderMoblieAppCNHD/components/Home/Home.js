import { View, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import MyStyles from "../../styles/MyStyles";
import React from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Searchbar } from "react-native-paper";
import RoomItem from "./RoomItem"; // Component hiển thị mỗi phòng trọ

const Home = () => {
    const [categories, setCategories] = React.useState([]);  // Danh mục các loại phòng trọ
    const [rooms, setRooms] = React.useState([]);  // Danh sách phòng trọ
    const [loading, setLoading] = React.useState(false);  // Trạng thái loading
    const [cateId, setCateId] = React.useState("");  // ID danh mục chọn
    const [page, setPage] = React.useState(1);  // Trang hiện tại
    const [q, setQ] = React.useState("");  // Từ khóa tìm kiếm

    // Tải danh mục phòng trọ (ví dụ: phòng trọ sinh viên, phòng trọ giá rẻ...)
    const loadCates = async () => {
        let res = await APIs.get(endpoints['categories']);
        setCategories(res.data);
    }

    // Tải danh sách phòng trọ theo các bộ lọc
    const loadRooms = async () => {
        if (page > 0) {
            setLoading(true);

            try {
                let url = `${endpoints['rooms']}?page=${page}`;

                if (cateId || q) 
                    url = `${url}&category_id=${cateId}&q=${q}`;  // Nếu có bộ lọc theo danh mục hoặc từ khóa

                let res = await APIs.get(url);
                if (page > 1) 
                    setRooms([...rooms, ...res.data.results]);  // Nối thêm dữ liệu cũ
                else 
                    setRooms(res.data.results);  // Lấy dữ liệu mới từ đầu

                if (res.data.next === null) 
                    setPage(0);  // Nếu không còn trang tiếp theo
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    // Tải lại dữ liệu khi các tham số thay đổi (category, page, search)
    React.useEffect(() => {
        loadCates();  // Tải danh mục ngay khi màn hình load
    }, []);

    React.useEffect(() => {
        let timer = setTimeout(() => loadRooms(), 500);  // Delay nhẹ để tránh gọi quá nhanh

        return () => clearTimeout(timer);
    }, [cateId, page, q]);  // Khi các tham số thay đổi thì sẽ gọi lại hàm loadRooms

    // Tải thêm dữ liệu khi người dùng kéo xuống
    const loadMore = () => {
        if (page > 0 && !loading) 
            setPage(page + 1);
    }

    // Chức năng tìm kiếm theo từ khóa hoặc danh mục
    const search = (value, callback) => {
        setPage(1);  // Reset trang khi thay đổi tìm kiếm
        callback(value);  // Thực hiện tìm kiếm
    }

    // Refresh lại dữ liệu
    const refresh = () => {
        setPage(1);
        loadRooms();
    }

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <View style={MyStyles.row}>
                <TouchableOpacity onPress={() => search("", setCateId)} >
                    <Chip style={MyStyles.margin} icon="label">Tất cả</Chip>
                </TouchableOpacity>
                {categories.map(c => (
                    <TouchableOpacity onPress={() => search(c.id, setCateId)} key={c.id}>
                        <Chip style={MyStyles.margin} icon="label" >{c.name}</Chip>
                    </TouchableOpacity>
                ))}
            </View>
            
            {loading && <ActivityIndicator />}

            <Searchbar 
                placeholder="Tìm phòng trọ..." 
                value={q} 
                onChangeText={t => search(t, setQ)} 
            />

            <FlatList 
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                onEndReached={loadMore} 
                data={rooms} 
                renderItem={({ item }) => (
                    <RoomItem 
                        key={item.id} 
                        item={item} 
                        routeName='roomDetail' 
                        params={{ 'roomId': item.id }} 
                    />
                )}
            />
        </View> 
    );
}

export default Home;
