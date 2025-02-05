import React, { useState, useEffect } from "react";
import { View, TextInput, Alert, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // For location
import { Picker } from '@react-native-picker/picker'; // Để sử dụng Picker
import MyStyles from "../../styles/MyStyles";
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker for Google Maps


const CreateListing = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [maxOccupants, setMaxOccupants] = useState("1");
    const [district, setDistrict] = useState(""); // Quận/Huyện
    const [city, setCity] = useState(""); // Thành phố
    const [image, setImage] = useState(null);
    const [latitude, setLatitude] = useState(null); // For latitude
    const [longitude, setLongitude] = useState(null); // For longitude

    const [region, setRegion] = useState({
        latitude: 10.8231,  // Default coordinates (Hồ Chí Minh)
        longitude: 106.6297,  // Default coordinates
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    // Function to request permissions and then open the image picker
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập thư viện ảnh.");
            return;
        }

        const response = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
        });

        if (response.cancelled) {
            console.log("User canceled image picker");
        } else if (response.assets && response.assets.length > 0) {
            setImage(response.assets[0].uri); // Save the selected image URI
        } else {
            Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
        }
    };

    // Function to get user location (latitude and longitude)
    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập vị trí.");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
    };

    // Call getLocation when component mounts
    useEffect(() => {
        getLocation();
    }, []);

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setRegion({
            ...region,
            latitude: latitude,
            longitude: longitude,
        });
        setLatitude(latitude);
        setLongitude(longitude);
    };

    const createListing = async () => {
        if (!title || !description || !price || !address || !latitude || !longitude || !district || !city) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập trước khi đăng tin.");
                return;
            }

            let formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("address", address);
            formData.append("district", district); // Quận/Huyện
            formData.append("city", city); // Thành phố
            formData.append("max_occupants", maxOccupants);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);

            if (image) {
                formData.append("image", {
                    uri: image,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            }

            const response = await fetch("https://hatien.pythonanywhere.com/listings/", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData = await response.json();
            if (response.ok) {
                Alert.alert("Thành công", "Phòng trọ đã được đăng!");
                setTitle("");
                setDescription("");
                setPrice("");
                setAddress("");
                setMaxOccupants("1");
                setDistrict("");
                setCity("");
                setImage(null);

                // Chuyển hướng đến màn hình Home sau khi đăng tin thành công
                navigation.navigate("home");
            } else {
                Alert.alert("Lỗi", responseData.message || "Không thể đăng phòng.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <Text style={MyStyles.subject}>Đăng tin cho thuê</Text>
                <TextInput
                    placeholder="Tiêu đề"
                    value={title}
                    onChangeText={setTitle}
                    style={MyStyles.input}
                />
                <TextInput
                    placeholder="Mô tả"
                    value={description}
                    onChangeText={setDescription}
                    style={MyStyles.input}
                />
                <TextInput
                    placeholder="Giá"
                    value={price}
                    onChangeText={setPrice}
                    style={MyStyles.input}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Địa chỉ"
                    value={address}
                    onChangeText={setAddress}
                    style={MyStyles.input}
                />

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
                        {/* Add more districts here */}
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

                <TouchableOpacity onPress={pickImage} style={{ padding: 10 }}>
                    <Text style={{ fontSize: 16 }}>
                        {image ? "Ảnh đã chọn:" : "Chọn ảnh:"}
                    </Text>
                </TouchableOpacity>

                {image && (
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />
                )}

                <Text style={{ fontSize: 16}}> Chọn vị trí: </Text>

                <MapView
                    style={{ width: '100%', height: 250 }}
                    region={region}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                </MapView>

                <Button
                    mode="contained"
                    onPress={createListing}
                    style={[MyStyles.button, { 
                        backgroundColor: '#FF4500',  // Màu cam đỏ
                        paddingVertical: 8,   // Giảm chiều cao
                        paddingHorizontal: 20, // Giảm chiều rộng
                        borderRadius: 30, // Làm nút tròn hơn
                    }]}
                >
                    Đăng phòng
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateListing;
