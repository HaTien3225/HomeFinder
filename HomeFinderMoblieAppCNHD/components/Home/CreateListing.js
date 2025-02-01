import React, { useState } from "react";
import { View, TextInput, Alert } from "react-native";
import { Button, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Đảm bảo import AsyncStorage
import MyStyles from "../../styles/MyStyles";

const CreateListing = ({ navigation }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const createListing = async () => {
        // Kiểm tra tính hợp lệ của các trường nhập
        if (!title || !description || !price) {
            Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập trước khi đăng tin.");
                return;
            }

            const response = await fetch('listings-create', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, description, price }),
            });

            if (response.ok) {
                Alert.alert("Thành công", "Phòng trọ đã được đăng!");
                // Reset lại các trường nhập sau khi đăng tin thành công
                setTitle("");
                setDescription("");
                setPrice("");
            } else {
                const errorData = await response.json(); // Lấy thông tin lỗi từ response nếu có
                Alert.alert("Lỗi", errorData.message || "Không thể đăng phòng.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
        }
    };

    return (
        <View style={MyStyles.container}>
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
            <Button mode="contained" onPress={createListing} style={MyStyles.button}>
                Đăng phòng
            </Button>
        </View>
    );
};

export default CreateListing;
