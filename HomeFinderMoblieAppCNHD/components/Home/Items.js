import { List } from "react-native-paper";
import { TouchableOpacity, Image, Text } from "react-native";
import MyStyles from "../../styles/MyStyles";
import { useNavigation } from "@react-navigation/native";

const Items = ({ item, routeName, params }) => {
    const nav = useNavigation();

    return (
        <List.Item
            title={item.title}  // Sử dụng 'title' từ Listing
            description={
                <>
                    <Text>Giá: {item.price} VND</Text>
                    <Text>Địa chỉ: {item.address}</Text>
                    <Text>Chủ nhà: {item.host.username}</Text>
                </>
            }
            left={() => (
                <TouchableOpacity onPress={() => nav.navigate(routeName, params)}>
                    <Image source={{ uri: item.images }} style={MyStyles.box} />
                </TouchableOpacity>
            )}
        />
    );
};

export default Items;
