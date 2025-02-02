import { View, ActivityIndicator, FlatList, RefreshControl, Text, Image } from "react-native";
import React from 'react';
import APIs from "../../configs/APIs";
import { Searchbar } from "react-native-paper";
import ListingItem from "./Items"; // Đảm bảo rằng bạn import đúng ListingItem
import MyStyles from '../../styles/MyStyles';

const Home = () => {
    const [listings, setListings] = React.useState([]);  // Danh sách phòng trọ
    const [loading, setLoading] = React.useState(false);  // Trạng thái loading
    const [q, setQ] = React.useState("");  // Từ khóa tìm kiếm
    const [page, setPage] = React.useState(1);  // Trang hiện tại

    

    const loadListings = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                // Cập nhật URL với tên miền
                let url = `https://hatien.pythonanywhere.com/listings/?page=${page}`;
                if (q) url += `&q=${q}`;

                console.log("Loading from URL:", url); // Debug URL
                const res = await APIs.get(url);

                if (page > 1) {
                    setListings((prevListings) => [...prevListings, ...res.data.results]);
                } else {
                    setListings(res.data.results);
                }

                if (!res.data.next) setPage(0);
            } catch (error) {
                console.error("Error loading listings:", error);
                alert("Không thể tải danh sách phòng trọ. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        }
    };

    React.useEffect(() => {
        let timer = setTimeout(() => loadListings(), 500); 
        return () => clearTimeout(timer);
    }, [q, page]);

    const loadMore = () => {
        if (page > 0 && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const search = (value) => {
        setPage(1);
        setQ(value);
    };

    const refresh = () => {
        setPage(1);
        loadListings();
    };

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            <Searchbar 
                placeholder="Tìm phòng trọ..." 
                value={q} 
                onChangeText={search} 
                  style={{ marginBottom: 10 }}
            />
           

            {loading && <ActivityIndicator size="large" />}

            {listings.length === 0 && !loading && <Text>Không có phòng trọ nào.</Text>}

            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                data={listings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListingItem
                        item={item} // Truyền item vào ListingItem
                        routeName="listingDetail"
                        params={{ listingId: item.id }}
                    />
                )}
            />
            

            
        </View>
        
        
    );
};

export default Home;
