import React, { useState, useEffect } from "react";
import { View, TextInput, Alert, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform, Image } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // For location
import MyStyles from "../../styles/MyStyles";
import MapView, { Marker } from 'react-native-maps'; // Import MapView and Marker for Google Maps

const CreateListing = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [address, setAddress] = useState("");
    const [maxOccupants, setMaxOccupants] = useState("1");
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
        if (!title || !description || !price || !address || !latitude || !longitude) {
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
                <TextInput
                    placeholder="Số người tối đa"
                    value={maxOccupants}
                    onChangeText={setMaxOccupants}
                    style={MyStyles.input}
                    keyboardType="numeric"
                />

                <Text>Chọn vị trí:</Text>
                <MapView
                    style={{ width: '100%', height: 250 }}
                    region={region}
                    onPress={handleMapPress}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
                </MapView>

                <TouchableOpacity onPress={pickImage}>
                    <Text>{image ? "Ảnh đã chọn" : "Chọn ảnh"}</Text>
                </TouchableOpacity>

                {image && (
                    <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />
                )}

                <Button
                    mode="contained"
                    onPress={createListing}
                    style={[MyStyles.button, { backgroundColor: '#56CCF2' }]}
                >
                    Đăng phòng
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CreateListing;
