import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { View, Image, StyleSheet } from "react-native"; // Thêm StyleSheet
import { Button, Text, Card } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/MyUserContext";

const UserProfile = ({ navigation }) => {
    const user = useContext(MyUserContext);  
    const dispatch = useContext(MyDispatchContext);  

    // Hàm đăng xuất
    const logout = async () => {
        await AsyncStorage.removeItem("token");  
        dispatch({ "type": "logout" });  
    };

    return (
        <View style={styles.container}>
            <Card style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                    <Image 
                        source={user?.avatar ? { uri: user.avatar } : require("../../assets/icon.png")} 
                        style={styles.avatar}
                    />
                </View>
                <Card.Content>
                    <Text style={styles.username}>{user?.username || "Chào người dùng"}</Text>

                    {/* Hiển thị thông tin người dùng */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Email: {user?.email || "Chưa có email"}</Text>
                        <Text style={styles.infoText}>Số điện thoại: {user?.phone_number || "Chưa có số điện thoại"}</Text>
                        <Text style={styles.infoText}>Vai trò: {user?.role === "host" ? "Chủ trọ" : "Người thuê trọ"}</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Nút đăng xuất */}
            <Button 
                mode="contained" 
                onPress={logout} 
                style={styles.buttonLogout}
            >
                Đăng xuất
            </Button>

            {/* Nút đăng ký làm chủ trọ nếu người dùng là tenant */}
            {user?.role === "tenant" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("RegisterHost")} 
                    style={styles.buttonAction}
                >
                    Đăng ký làm chủ trọ
                </Button>
            )}

            {/* Nút đăng tin cho thuê nếu người dùng là host */}
            {user?.role === "host" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("CreateListing")} 
                    style={styles.buttonAction}
                >
                    Đăng tin cho thuê
                </Button>
            )}

            {/* Nút tìm phòng nếu là tenant */}
            {user?.role === "tenant" && (
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate("PostNotificationScreen")} 
                    style={styles.buttonAction}
                >
                    Đăng tin tìm phòng
                </Button>
            )}
        </View>
    );
};

// Khai báo styles với StyleSheet.create
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f9",
    },
    profileCard: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 5,
        marginBottom: 20,
        padding: 20,
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#ccc",
        marginBottom: 15,
    },
    username: {
        fontSize: 24,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        marginBottom: 10,
    },
    infoContainer: {
        marginTop: 15,
    },
    infoText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
        textAlign: "left",
    },
    buttonLogout: {
        backgroundColor: "#AF6347",  // Màu cam đỏ
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 25,
        width: "80%",
    },
    buttonAction: {
        backgroundColor: "#FF6347",  // Màu xanh dương
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 25,
        width: "80%",
    },
});

export default UserProfile;
