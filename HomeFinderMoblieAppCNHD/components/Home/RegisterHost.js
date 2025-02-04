import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need permission to access your photo library.');
      }
    };
    requestPermissions();

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

      images.forEach((image, index) => {
        if (image) {
          formData.append(`image_${index + 1}`, {
            uri: image,
            name: `image${index + 1}.jpg`,
            type: 'image/jpeg',
          });
        }
      });

      const response = await fetch('https://hatien.pythonanywhere.com/users/update-profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thành công', 'Bạn đã đăng ký làm chủ trọ.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'home' }],
        });
      } else {
        Alert.alert('Lỗi', data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Đăng Ký Làm Chủ Trọ</Text>
      <Text style={styles.info}>Email: {email}</Text>
      <Text style={styles.info}>Username: {username}</Text>
      <Text style={styles.info}>Role: {role}</Text>

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ dãy trọ"
        value={address}
        onChangeText={setAddress}
      />

      {images.map((image, index) => (
        <View key={index} style={styles.imageContainer}>
          <TouchableOpacity onPress={() => pickImage(index)} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Chọn ảnh {index + 1}</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
        <Text style={styles.submitButtonText}>Xác nhận đăng ký</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#56CCF2',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 120,
    height: 120,
    marginTop: 10,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterHost;
