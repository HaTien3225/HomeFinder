import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterHost = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([null, null, null]); // Mảng lưu ảnh
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Xin quyền truy cập thư viện ảnh
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      }
    };
    requestPermissions();

    // Lấy token từ AsyncStorage
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      } else {
        Alert.alert('Lỗi', 'Bạn chưa đăng nhập.');
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    // Lấy dữ liệu user
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://hatien.pythonanywhere.com/users/current-user/', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setEmail(data.email);
          setUsername(data.username);
          setRole(data.role);
        } else {
          Alert.alert('Lỗi', data.message || 'Không thể tải dữ liệu người dùng.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
      }
    };
    fetchUserData();
  }, [token]);

  const pickImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled) {
      const newImages = [...images];
      newImages[index] = result.assets[0].uri;
      setImages(newImages);
      console.log(`Image ${index + 1} URI:`, result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    if (!phoneNumber.trim() || !address.trim() || images.some(img => img === null)) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin và tải lên đủ 3 ảnh.');
      return;
    }
    if (!token) {
      Alert.alert('Lỗi', 'Token không hợp lệ hoặc hết hạn.');
      return;
    }
    try {
      let formData = new FormData();
      formData.append('phone_number', phoneNumber);
      formData.append('role', 'host');
      formData.append('address', address);

      // Upload 3 ảnh
      images.forEach((image, index) => {
        if (image) {
          formData.append(`image_${index + 1}`, {
            uri: image,
            name: `image${index + 1}.jpg`, // Đảm bảo có đuôi .jpg
            type: 'image/jpeg',  // Định dạng chuẩn cho server
          });
          console.log(`Image ${index + 1} added to FormData:`, image);
        }
      });

      console.log('🔍 FormData Contents:', JSON.stringify(formData, null, 2)); // Debug

      const response = await fetch('https://hatien.pythonanywhere.com/users/update-profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Đặt Content-Type rõ ràng
        },
        body: formData,
      });

      const data = await response.json();
      console.log('🔍 Server Response:', data); // Debug toàn bộ phản hồi server

      if (response.ok) {
        Alert.alert('Thành công', 'Bạn đã đăng ký làm chủ trọ.');
        navigation.navigate('home');
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('❌ Error during registration:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Đăng Ký Làm Chủ Trọ</Text>
      <Text>Email: {email}</Text>
      <Text>Username: {username}</Text>
      <Text>Role: {role}</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 8,
        }}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 8,
        }}
        placeholder="Địa chỉ dãy trọ"
        value={address}
        onChangeText={setAddress}
      />
      {images.map((image, index) => (
        <View key={index}>
          <Button title={`Chọn ảnh ${index + 1}`} onPress={() => pickImage(index)} />
          {image && (
            <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />
          )}
        </View>
      ))}
      <Button title="Xác nhận đăng ký" onPress={handleRegister} />
    </View>
  );
};

export default RegisterHost;
