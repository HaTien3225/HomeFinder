import { View, ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from 'react';
import APIs from "../../configs/APIs";
import { Searchbar } from "react-native-paper";
import ListingItem from "./Items"; // Đảm bảo rằng bạn import đúng ListingItem
import MyStyles from '../../styles/MyStyles';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon

const Home = () => {
    const [listings, setListings] = useState([]);  // Danh sách phòng trọ
    const [loading, setLoading] = useState(false);  // Trạng thái loading
    const [q, setQ] = useState("");  // Từ khóa tìm kiếm
    const [page, setPage] = useState(1);  // Trang hiện tại
    const [location, setLocation] = useState("");  // Vị trí (địa chỉ)
    const [district, setDistrict] = useState("");  // Quận/huyện
    const [city, setCity] = useState("");  // Thành phố
    const [minPrice, setMinPrice] = useState("");  // Giá tối thiểu
    const [maxPrice, setMaxPrice] = useState("");  // Giá tối đa
    const [maxOccupants, setMaxOccupants] = useState("");  // Số người tối đa
    const [filtersVisible, setFiltersVisible] = useState(false); // Trạng thái hiển thị bộ lọc

    // Hàm tải danh sách phòng trọ
    const loadListings = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `https://hatien.pythonanywhere.com/listings/?page=${page}`;
                
                // Thêm các bộ lọc vào URL
                if (q) url += `&q=${q}`;
                if (location) url += `&address=${location}`;
                if (district) url += `&district=${district}`;
                if (city) url += `&city=${city}`;
                if (minPrice) url += `&min_price=${minPrice}`;
                if (maxPrice) url += `&max_price=${maxPrice}`;
                if (maxOccupants) url += `&max_occupants=${maxOccupants}`;

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

    useEffect(() => {
        let timer = setTimeout(() => loadListings(), 500); 
        return () => clearTimeout(timer);
    }, [q, location, district, city, minPrice, maxPrice, maxOccupants, page]);

    // Hàm tải thêm phòng trọ khi cuộn xuống
    const loadMore = () => {
        if (page > 0 && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Hàm tìm kiếm khi người dùng thay đổi giá trị
    const search = (value) => {
        setPage(1);
        setQ(value);
    };

    // Hàm refresh danh sách
    const refresh = () => {
        setPage(1);
        loadListings();
    };

    // Hàm áp dụng bộ lọc
    const applyFilters = () => {
        setPage(1); // Reset trang khi áp dụng bộ lọc
        loadListings(); // Tải lại danh sách với bộ lọc
    };

    return (
        <View style={[MyStyles.container, MyStyles.margin]}>
            {/* Thanh tìm kiếm */}
            <Searchbar 
                placeholder="Tìm phòng trọ..." 
                value={q} 
                onChangeText={search} 
                style={{ marginBottom: 10 }}
            />
            
            {/* Nút để hiển thị/ẩn bộ lọc */}
            <TouchableOpacity 
                onPress={() => setFiltersVisible(!filtersVisible)} 
                style={{
                    marginBottom: 10, 
                    paddingVertical: 10, 
                    flexDirection: 'row', // Sắp xếp theo hàng ngang
                    justifyContent: 'space-between', // Căn chỉnh nội dung
                    alignItems: 'center', // Căn giữa theo chiều dọc
                    borderBottomWidth: 1, 
                    borderBottomColor: '#ccc', // Thêm viền dưới để tạo sự phân chia
                }}
            >
                <Text style={{ color: 'blue', fontWeight: 'bold' }}>
                    {filtersVisible ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                </Text>
                
                <Icon 
                    name={filtersVisible ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="blue" 
                />
            </TouchableOpacity>

            {/* Bộ lọc tìm kiếm */}
            {filtersVisible && (
                <View style={{ marginBottom: 20 }}>
                    <TextInput
                        placeholder="Vị trí (địa chỉ)"
                        value={location}
                        onChangeText={setLocation}
                        style={MyStyles.input}
                    />

                    {/* Bộ lọc giá */}
                    <View style={MyStyles.filterRow}>
                        <TextInput
                            placeholder="Giá tối thiểu"
                            value={minPrice}
                            onChangeText={setMinPrice}
                            keyboardType="numeric"
                            style={[MyStyles.input, { width: "45%" }]}/>
                        <TextInput
                            placeholder="Giá tối đa"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                            keyboardType="numeric"
                            style={[MyStyles.input, { width: "45%" }]}/>
                    </View>

                    {/* Bộ lọc Quận/Huyện và Thành phố */}
                    <View style={MyStyles.filterRow}>
                        <Picker
                            selectedValue={district}
                            style={MyStyles.input}
                            onValueChange={(itemValue) => setDistrict(itemValue)}
                        >
                            <Picker.Item label="Chọn Quận/Huyện" value="" />
                            <Picker.Item label="Quận 1" value="District1" />
                            <Picker.Item label="Quận 2" value="District2" />
                             <Picker.Item label="Quận 3" value="District3" />
                                                                                <Picker.Item label="Quận 4" value="District4" />
                                                                                <Picker.Item label="Quận 5" value="District5" />
                                                                                <Picker.Item label="Quận 6" value="District6" />
                                                                                <Picker.Item label="Quận 7" value="District7" />
                                                                                <Picker.Item label="Quận 8" value="District8" />
                                                                                <Picker.Item label="Quận 9" value="District9" />
                                                                                <Picker.Item label="Quận 10" value="District10" />
                                                                                <Picker.Item label="Quận 11" value="District11" />
                                                                                <Picker.Item label="Quận 12" value="District12" />
                                                                                <Picker.Item label="Quận Bình Thạnh" value="BinhThanh" />
                                                                                <Picker.Item label="Quận Gò Vấp" value="GoVap" />
                                                                                <Picker.Item label="Quận Tân Bình" value="TanBinh" />
                                                                                <Picker.Item label="Quận Tân Phú" value="TanPhu" />
                                                                                <Picker.Item label="Quận Phú Nhuận" value="PhuNhuan" />
                                                                                <Picker.Item label="Quận Bình Tân" value="BinhTan" />
                                                                                <Picker.Item label="Quận Thủ Đức" value="ThuDuc" />
                                                                                <Picker.Item label="Huyện Củ Chi" value="CuChi" />
                                                                                <Picker.Item label="Huyện Hóc Môn" value="HocMon" />
                                                                                <Picker.Item label="Huyện Nhà Bè" value="NhaBe" />
                                                                                <Picker.Item label="Huyện Bình Chánh" value="BinhChanh" />
                                                    
                        </Picker>

                        <Picker
                            selectedValue={city}
                            style={MyStyles.input}
                            onValueChange={(itemValue) => setCity(itemValue)}
                        >
                            <Picker.Item label="Chọn Thành Phố" value="" />
                            <Picker.Item label="Hà Nội" value="HaNoi" />
                            <Picker.Item label="Hồ Chí Minh" value="HoChiMinh" />
                        </Picker>
                    </View>

                    {/* Bộ lọc Số người tối đa */}
                    <Picker
                        selectedValue={maxOccupants}
                        style={MyStyles.input}
                        onValueChange={(itemValue) => setMaxOccupants(itemValue)}
                    >
                        <Picker.Item label="Số người tối đa" value="" />
                        <Picker.Item label="1 người" value="1" />
                        <Picker.Item label="2 người" value="2" />
                        <Picker.Item label="3 người" value="3" />
                        <Picker.Item label="4 người" value="4" />
                        <Picker.Item label="5 người" value="5" />
                    </Picker>

                    {/* Nút "Áp dụng bộ lọc" */}
                    <TouchableOpacity 
                        onPress={applyFilters}
                        style={{
                            backgroundColor: 'blue',
                            padding: 10,
                            borderRadius: 5,
                            alignItems: 'center',
                            marginTop: 10
                        }}
                    >
                        <Text style={{ color: 'white' }}>Áp dụng bộ lọc</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Trạng thái loading */}
            {loading && <ActivityIndicator size="large" />}

            {/* Hiển thị khi không có dữ liệu */}
            {listings.length === 0 && !loading && (
                <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                    {q || location || district || city || minPrice || maxPrice || maxOccupants 
                        ? "Không tìm thấy phòng trọ với các tiêu chí tìm kiếm hiện tại."
                        : "Không có phòng trọ nào."}
                </Text>
            )}

            {/* Danh sách phòng trọ */}
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
                showsVerticalScrollIndicator={false} 
            />
        </View>
    );
};

export default Home;
