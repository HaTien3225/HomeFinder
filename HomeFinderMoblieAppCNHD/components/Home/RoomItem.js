import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import styles from './styles';

const RoomItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>${item.price}/tháng</Text>
      <Button title="Xem chi tiết" onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })} />
    </View>
  );
};

export default RoomItem;