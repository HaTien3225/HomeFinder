import { View, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import React from 'react';
import APIs, { endpoints } from "../../configs/APIs";
import { Chip, Searchbar } from "react-native-paper";
import ListingItem from "./Items"; // Đảm bảo tên file và import đúng
import MyStyles from '../../styles/MyStyles';

const Home = () => {
    const [listings, setListings] = React.useState([]);  // Danh sách phòng trọ
    const [loading, setLoading] = React.useState(false);  // Trạng thái loading
    const [q, setQ] = React.useState("");  // Từ khóa tìm kiếm
    const [page, setPage] = React.useState(1);  // Trang hiện tại

    // Tải danh sách phòng trọ theo các bộ lọc
    const loadListings = async () => {
        if (page > 0) {
            setLoading(true);

            try {
                let url = `${endpoints['listings-list']}?page=${page}`;
                if (q) 
                    url += `&q=${q}`;  // Thêm từ khóa tìm kiếm vào URL

                let res = await APIs.get(url);
                if (page > 1) 
                    setListings((prevListings) => [...prevListings, ...res.data.results]);  // Nếu là trang tiếp theo thì gộp dữ liệu
                else 
                    setListings(res.data.results);  // Trang đầu tiên thì thay thế danh sách

                if (!res.data.next) 
                    setPage(0);  // Nếu không có trang tiếp theo thì ngừng tải thêm
            } catch (ex) {
                console.error("Error loading listings:", ex);
            } finally {
                setLoading(false);
            }
        }
    };

    // Tải lại dữ liệu khi từ khóa thay đổi
    React.useEffect(() => {
        let timer = setTimeout(() => loadListings(), 500);  // Delay để tránh tải lại quá nhanh
        return () => clearTimeout(timer);
    }, [q, page]);  // Khi từ khóa hoặc trang thay đổi, tải lại danh sách

    // Tải thêm dữ liệu khi người dùng kéo xuống
    const loadMore = () => {
        if (page > 0 && !loading) 
            setPage((prevPage) => prevPage + 1);  // Chuyển sang trang tiếp theo khi người dùng kéo xuống
    };

    // Chức năng tìm kiếm theo từ khóa
    const search = (value) => {
        setPage(1);  // Reset về trang 1 khi tìm kiếm lại
        setQ(value);  // Cập nhật từ khóa tìm kiếm
    };

    // Refresh lại dữ liệu
    const refresh = () => {
        setPage(1);  // Reset về trang 1 khi refresh
        loadListings();
    };

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <Searchbar 
                placeholder="Tìm phòng trọ..." 
                value={q} 
                onChangeText={search} 
            />

            {loading && <ActivityIndicator />}

            <FlatList 
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                onEndReached={loadMore} 
                onEndReachedThreshold={0.5} // Đảm bảo gọi loadMore khi gần cuối
                data={listings} 
                keyExtractor={(item) => item.id.toString()} // Dùng keyExtractor thay vì key trong renderItem
                renderItem={({ item }) => (
                    <ListingItem 
                        item={item} 
                        routeName="listingDetail" 
                        params={{ listingId: item.id }} 
                    />
                )}
            />
        </View> 
    );
};

export default Home;
