import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { MyDispatchContext } from "../../configs/MyUserContext";
import MyStyles from "../../styles/MyStyles";

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [securePassword, setSecurePassword] = useState(true); // Trạng thái ẩn/hiện mật khẩu
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Thông báo lỗi nếu đăng nhập thất bại
  const dispatch = useContext(MyDispatchContext);
  const nav = useNavigation();

  const users = {
    username: {
      title: "Tên đăng nhập",
      field: "username",
      icon: "text",
      secureTextEntry: false,
    },
    password: {
      title: "Mật khẩu",
      field: "password",
      icon: securePassword ? "eye-off" : "eye", // Thay đổi biểu tượng theo trạng thái
      secureTextEntry: securePassword,
    },
  };

  const change = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const toggleSecurePassword = () => {
    setSecurePassword((prev) => !prev); // Chuyển đổi trạng thái ẩn/hiện mật khẩu
  };

  const login = async () => {
    if (!user.username || !user.password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    setError(null); // Reset lỗi cũ nếu có

    try {
      const res = await APIs.post(
        endpoints["users-login"],
        {
          username: user.username,
          password: user.password,
          grant_type: "password",
          client_id: 'Xg35Jk4OJyJp5W1tKH3vRX9znJUoMUbfiyHqNzRe',
          client_secret:
            "HXmngeKB8IbQ5vVOuO6OimrPATQBYwqiaOejW0eu0pNpzfEcklE53pIp1SRRfspgRQmKYnlavGevGyzVfBDOHtV1DkwZHVhsaGnTIxqk3qaMlZvEUVjNJH3U1P8jAqlo",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await AsyncStorage.setItem("token", res.data.access_token);

      const userResponse = await APIs.get(endpoints["users-get-user"], {
        headers: { Authorization: `Bearer ${res.data.access_token}` },
      });

      dispatch({
        type: "login",
        payload: userResponse.data,
      });

      nav.navigate("home");
    } catch (ex) {
      console.error("Login Error:", ex.response?.data || ex.message);

      if (ex.response?.data?.error === "invalid_grant") {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      } else {
        setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Tạo input cho tên đăng nhập */}
      <TextInput
        secureTextEntry={users.username.secureTextEntry}
        value={user.username}
        onChangeText={(text) => change(text, "username")}
        style={styles.input}
        placeholder={users.username.title}
        right={<TextInput.Icon icon={users.username.icon} />}
      />

      {/* Tạo input cho mật khẩu */}
      <TextInput
        secureTextEntry={users.password.secureTextEntry}
        value={user.password}
        onChangeText={(text) => change(text, "password")}
        style={styles.input}
        placeholder={users.password.title}
        right={
          <TextInput.Icon
            icon={users.password.icon}
            onPress={toggleSecurePassword} // Thêm sự kiện khi bấm vào icon
          />
        }
      />

      <Button
        loading={loading}
        mode="contained"
        onPress={login}
        disabled={loading}
        style={styles.button}
      >
        ĐĂNG NHẬP
      </Button>

      {loading && <Text style={styles.loadingText}>Đang đăng nhập...</Text>}

      {/* Chuyển hướng đến trang đăng ký nếu chưa có tài khoản */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => nav.navigate("register")}>
          <Text style={styles.signupLink}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 50,
    paddingLeft: 15,
  },
  button: {
    backgroundColor: "#FF6347",
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6347",
  },
});

export default Login;
