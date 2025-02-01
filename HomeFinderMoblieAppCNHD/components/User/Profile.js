import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
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
        dispatch({
            type: "setRole",
            payload: { role: "host" },  // Cập nhật vai trò của người dùng thành "host"
        });
    };

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>
                {user?.username ? `Chào ${user.username}` : 'Chào người dùng'} {/* Handle if username is undefined */}
            </Text>
            <Button mode="contained-tonal" onPress={logout} style={MyStyles.margin}>
                Đăng xuất
            </Button>
            {user?.role === "tenant" && (
                <Button mode="contained" onPress={registerHost} style={MyStyles.margin}>
                    Đăng ký làm chủ trọ
                </Button>
            )}
            {user?.role === "host" && (
                <Button mode="contained" onPress={() => navigation.navigate("CreateListing")} style={MyStyles.margin}>
                    Đăng tin cho thuê
                </Button>
            )}
        </View>
    );
};

export default UserProfile;
