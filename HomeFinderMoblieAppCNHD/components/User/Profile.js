import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { View, Image } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";

const UserProfile = ({ navigation }) => {
    const user = useContext(MyUserContext);  // Lấy thông tin người dùng từ context
    const dispatch = useContext(MyDispatchContext);  // Dùng dispatch để cập nhật trạng thái

    // Hàm đăng xuất
    const logout = async () => {
        await AsyncStorage.removeItem("token");  // Xóa token khỏi AsyncStorage
        dispatch({ "type": "logout" });  // Gửi action để cập nhật trạng thái đăng xuất trong context
    };

    // Hàm đăng ký làm chủ trọ
    const registerHost = async () => {
        navigation.navigate("RegisterHost");
    };

    return (
        <View style={MyStyles.container}>
            <Card style={MyStyles.profileCard}>
                {/* Hiển thị ảnh đại diện người dùng */}
                <View style={MyStyles.avatarContainer}>
                    {/* Kiểm tra ảnh avatar */}
                    <Image 
                        source={user?.avatar ? { uri: user.avatar } : require("../../assets/icon.png")} 
                        style={MyStyles.avatar}
                    />
                </View>
                <Card.Content>
                    {/* Tên người dùng */}
                    <Text style={MyStyles.username}>{user?.username || "Chào người dùng"}</Text>

                    {/* Hiển thị thông tin người dùng */}
                    <View style={MyStyles.infoContainer}>
                        <Text>Email: {user?.email || "Chưa có email"}</Text>
                        <Text>Số điện thoại: {user?.phone_number || "Chưa có số điện thoại"}</Text>
                        <Text>Vai trò: {user?.role === "host" ? "Chủ trọ" : "Người thuê trọ"}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Nút đăng xuất */}
            <Button mode="contained-tonal" onPress={logout} style={MyStyles.margin}>
                Đăng xuất
            </Button>

            {/* Nút đăng ký làm chủ trọ nếu người dùng là tenant */}
            {user?.role === "tenant" && (
                <Button mode="contained" onPress={registerHost} style={MyStyles.margin}>
                    Đăng ký làm chủ trọ
                </Button>
            )}

            {/* Nút đăng tin cho thuê nếu người dùng là host */}
            {user?.role === "host" && (
                <Button mode="contained" onPress={() => navigation.navigate("CreateListing")} style={MyStyles.margin}>
                    Đăng tin cho thuê
                </Button>
            )}
        </View>
    );
};

export default UserProfile;
