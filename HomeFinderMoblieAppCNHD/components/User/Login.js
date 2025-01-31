import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { View, Text } from "react-native";
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
          client_id: 'MdzBsYRoQzBAsB9D6lciSZrtfsHO6MvwrVneZZLu',
          client_secret:
            "DOpA0BBOr1slSZ5RMbZH8lZ9CnFT7CUKS6433rzVal9fq6TaZAf5MTyUu8u7boJOy2nCqZlqOYDi6ggc2MdRqWGDqXpH75eoVCxzCX6LyL7a0lccdIeDiqZJQt3whBc9",
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

      if (ex.response?.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      } else {
        setError("Lỗi kết nối đến máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={MyStyles.container}>
      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}

      {/* Tạo input cho tên đăng nhập */}
      <TextInput
        secureTextEntry={users.username.secureTextEntry}
        value={user.username}
        onChangeText={(text) => change(text, "username")}
        style={MyStyles.margin}
        placeholder={users.username.title}
        right={<TextInput.Icon icon={users.username.icon} />}
      />

      {/* Tạo input cho mật khẩu */}
      <TextInput
        secureTextEntry={users.password.secureTextEntry}
        value={user.password}
        onChangeText={(text) => change(text, "password")}
        style={MyStyles.margin}
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
        style={MyStyles.margin}
      >
        ĐĂNG NHẬP
      </Button>

      {loading && <Text>Đang đăng nhập...</Text>}
    </View>
  );
};

export default Login;
