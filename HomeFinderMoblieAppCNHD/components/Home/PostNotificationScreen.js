import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const PostNotificationScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');

  const handlePost = async () => {
    const postData = {
      title,
      description,
      price_range: priceRange,
      preferred_location: preferredLocation
    };

    console.log("Dữ liệu gửi đi:", postData);

    try {
      const response = await axios.post(
        'https://hatien.pythonanywhere.com/room_requests/',
        postData
      );

      console.log('Thông báo đã được gửi:', response.data);
      
      // Reset form sau khi gửi thành công
      setTitle('');
      setDescription('');
      setPriceRange('');
      setPreferredLocation('');

        // Chuyển đến danh sách & yêu cầu refresh
    navigation.replace("TenantRequests", { refresh: true });

    } catch (error) {
      console.error('Lỗi:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Tiêu đề" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Mô tả" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Khoảng giá" value={priceRange} onChangeText={setPriceRange} />
      <TextInput style={styles.input} placeholder="Vị trí ưu tiên" value={preferredLocation} onChangeText={setPreferredLocation} />
      <Button title=" Tìm kiếm " onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, marginBottom: 16, padding: 8, borderRadius: 5 }
});

export default PostNotificationScreen;
