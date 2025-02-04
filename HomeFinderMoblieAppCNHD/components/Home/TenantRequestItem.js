import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const TenantRequestItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("RequestDetailScreen", { item });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item?.title || "No Title"}</Text>
          <Paragraph style={styles.location}>📍 {item?.preferred_location}</Paragraph>
          <Paragraph style={styles.price}>💰 Giá: {item?.price_range} VND</Paragraph>
          <Paragraph numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
            Mô tả: {item?.description}
          </Paragraph>
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
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27ae60",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default TenantRequestItem;
