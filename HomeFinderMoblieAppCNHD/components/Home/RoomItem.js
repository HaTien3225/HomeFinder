import React from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet } from 'react-native';
import MyStyles from '../../styles/MyStyles';


const RoomItem = ({ item, navigation }) => {
  const [loadingImage, setLoadingImage] = useState(false);

  const handleErrorImage = () => {
    setLoadingImage(false);
  };

  return (
    <View style={[MyStyles.container]}>
      {loadingImage ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Image
          source={{ uri: item.image }}
          style={MyStyles.image}
          onLoadEnd={handleErrorImage}
          onError={handleErrorImage}
        />
      )}
      <Text style={MyStyles.title}>{item.name}</Text>
      <Text style={MyStyles.price}>${item.price}/tháng</Text>
      <Button
        title="Xem chi tiết"
        onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })}
        color="#4285F4" // Tùy chỉnh màu button
      />
    </View>
  );
};

export default RoomItem;