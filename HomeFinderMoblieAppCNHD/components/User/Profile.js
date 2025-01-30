import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";

const UserProfile = () => {
    const user = useContext(MyUserContext);  // Lấy thông tin người dùng từ context
    const dispatch = useContext(MyDispatchContext);  // Dùng dispatch để cập nhật trạng thái

    // Hàm đăng xuất
    const logout = async () => {
        await AsyncStorage.removeItem("token");  // Xóa token khỏi AsyncStorage
        dispatch({
            "type": "logout"  // Gửi action để cập nhật trạng thái đăng xuất trong context
        });
    }

    return (
        <View style={MyStyles.container}>
            <Text style={MyStyles.subject}>Chào {user?.username}</Text>  {/* Hiển thị tên người dùng */}
            <Button mode="contained-tonal" onPress={logout} style={MyStyles.margin}>
                Đăng xuất
            </Button>
        </View>
    );
}

export default UserProfile;
