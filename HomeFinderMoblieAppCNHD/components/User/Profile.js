import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { View, Image } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";

const UserProfile = ({ navigation }) => {
    const user = useContext(MyUserContext);  
    const dispatch = useContext(MyDispatchContext);  

    // Hàm đăng xuất
    const logout = async () => {
        await AsyncStorage.removeItem("token");  
        dispatch({ "type": "logout" });  
    };

    return (
        <View style={MyStyles.container}>
            <Card style={[MyStyles.profileCard, { elevation: 5 }]}>
                {/* Hiển thị ảnh đại diện người dùng */}
                <View style={MyStyles.avatarContainer}>
                    <Image 
                        source={user?.avatar ? { uri: user.avatar } : require("../../assets/icon.png")} 
                        style={MyStyles.avatar}
                    />
                </View>
                <Card.Content>
                    <Text style={MyStyles.username}>{user?.username || "Chào người dùng"}</Text>

                    {/* Hiển thị thông tin người dùng */}
                    <View style={MyStyles.infoContainer}>
                        <Text style={MyStyles.infoText}>Email: {user?.email || "Chưa có email"}</Text>
                        <Text style={MyStyles.infoText}>Số điện thoại: {user?.phone_number || "Chưa có số điện thoại"}</Text>
                        <Text style={MyStyles.infoText}>Vai trò: {user?.role === "host" ? "Chủ trọ" : "Người thuê trọ"}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Nút đăng xuất */}
            <Button 
                mode="contained-tonal" 
                onPress={logout} 
                style={[MyStyles.margin, { backgroundColor: '#FF4B5C', marginTop: 20, marginBottom: 10 }]}
            >
                Đăng xuất
            </Button>

            {/* Nút đăng ký làm chủ trọ nếu người dùng là tenant */}
            {user?.role === "tenant" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("RegisterHost")} 
                    style={[MyStyles.margin, { backgroundColor: '#56CCF2', marginBottom: 10 }]}
                >
                    Đăng ký làm chủ trọ
                </Button>
            )}

            {/* Nút đăng tin cho thuê nếu người dùng là host */}
            {user?.role === "host" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("CreateListing")} 
                    style={[MyStyles.margin, { backgroundColor: '#56CCF2', marginBottom: 10 }]}
                >
                    Đăng tin cho thuê
                </Button>
            )}

            {/* ✅ Chỉ hiển thị nút này nếu là khách thuê (tenant) */}
            {user?.role === "tenant" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("PostNotificationScreen")} 
                    style={[MyStyles.margin, { backgroundColor: '#56CCF2', marginBottom: 10 }]}
                >
                    Đăng tin tìm phòng
                </Button>
            )}
        </View>
    );
};

export default UserProfile;
