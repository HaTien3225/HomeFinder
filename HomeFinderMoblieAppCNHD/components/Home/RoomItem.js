import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Import navigation
import styles from './styles';

const RoomItem = ({ item }) => {
  const navigation = useNavigation();  // Khởi tạo navigation

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.images }} style={styles.image} />  
      <Text style={styles.title}>{item.title}</Text> 
      <Text style={styles.price}>{item.price} VNĐ/tháng</Text>  
      <Button>
        title="Xem chi tiết"
        onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })}  
      </Button>
      </View>
  );
};

export default RoomItem;
