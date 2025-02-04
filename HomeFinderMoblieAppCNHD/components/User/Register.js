import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Button, TextInput, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
  const [user, setUser] = useState({});
  const [secureEntries, setSecureEntries] = useState({
    password: true,
    confirm: true,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
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
      icon: secureEntries.password ? "eye-off" : "eye",
      secureTextEntry: secureEntries.password,
    },
    confirm: {
      title: "Xác nhận mật khẩu",
      field: "confirm",
      icon: secureEntries.confirm ? "eye-off" : "eye",
      secureTextEntry: secureEntries.confirm,
    },
    email: {
      title: "Email",
      field: "email",
      secureTextEntry: false,
    },
  };

  const change = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const toggleSecureEntry = (field) => {
    setSecureEntries((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled) {
        const image = result.assets[0];
        setUser({ ...user, avatar: image });
      }
    }
  };

  const validateForm = () => {
    if (!user.username) {
      setErr("Tên đăng nhập không được để trống!");
      return false;
    }
    if (user.username.length < 6) {
      setErr("Tên đăng nhập phải có ít nhất 6 ký tự!");
      return false;
    }
    if (!user.email || !/\S+@\S+\.\S+/.test(user.email)) {
      setErr("Email không hợp lệ!");
      return false;
    }
    if (!user.password || user.password.length < 6) {
      setErr("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }
    if (user.password !== user.confirm) {
      setErr("Mật khẩu và xác nhận mật khẩu không khớp!");
      return false;
    }
    if (!user.avatar) {
      setErr("Bạn cần chọn ảnh đại diện!");
      return false;
    }
    setErr("");
    return true;
  };

  const register = async () => {
    if (!validateForm()) return;

    let form = new FormData();

    Object.keys(user).forEach((key) => {
      if (key === "avatar" && user.avatar) {
        const { uri, mimeType, fileName } = user.avatar;
        const name = fileName || uri.split('/').pop();

        form.append("avatar", {
          uri: uri,
          name: name,
          type: mimeType || "image/jpeg",
        });
      } else if (key !== "confirm") {
        form.append(key, user[key]);
      }
    });

    form.append("is_active", true);

    setLoading(true);
    try {
      const res = await APIs.post(endpoints["users-create"], form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.info("Đăng ký thành công:", res.data);
      nav.navigate("login");
    } catch (ex) {
      console.error("Lỗi khi đăng ký:", ex.response?.data || ex.message);
      setErr(ex.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <HelperText type="error" visible={!!err} style={styles.errorText}>
          {err}
        </HelperText>

        {Object.values(users).map((u) => (
          <TextInput
            key={u.field}
            secureTextEntry={u.secureTextEntry}
            value={user[u.field]}
            onChangeText={(t) => change(t, u.field)}
            style={styles.input}
            placeholder={u.title}
            right={u.icon ? (
              <TextInput.Icon
                icon={u.icon}
                onPress={() => toggleSecureEntry(u.field)}
              />
            ) : null}
          />
        ))}

        <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
          <Text style={styles.imagePickerText}>Chọn ảnh đại diện...</Text>
        </TouchableOpacity>

        {user.avatar && (
          <Image source={{ uri: user.avatar.uri }} style={styles.avatarPreview} />
        )}

        <Button
          loading={loading}
          mode="contained"
          onPress={register}
          disabled={loading}
          style={styles.button}
        >
          ĐĂNG KÝ
        </Button>
      </KeyboardAvoidingView>
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
  imagePickerButton: {
    marginBottom: 15,
    paddingVertical: 10,
    borderColor: "#FF6347",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#FF6347",
    fontWeight: "bold",
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
});

export default Register;
