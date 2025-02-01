import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const ListingItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("ListingDetail", { item });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item?.image }} style={styles.image} />
        <Card.Content>
          <Text style={styles.title}>{item?.title || "No Title"}</Text>
          <Paragraph style={styles.price}>💰 Giá: {item?.price} VND</Paragraph>
          <Paragraph style={styles.address}>📍 {item?.address}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "white",
  },
  image: {
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6347",
    marginTop: 5,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default ListingItem;
