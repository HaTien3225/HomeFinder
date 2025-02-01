// screens/PostNotificationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const PostNotificationScreen = () => {
  const [notification, setNotification] = useState('');

  const handlePost = async () => {
    try {
      const response = await axios.post('https://hatien.pythonanywhere.com/notifications/', { content: notification });
      console.log('Thông báo đã được gửi:', response.data);
      setNotification('');
    } catch (error) {
      console.error('Lỗi khi gửi thông báo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập thông báo của bạn"
        value={notification}
        onChangeText={setNotification}
        multiline
      />
      <Button title="Gửi Thông Báo" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
});

export default PostNotificationScreen;
