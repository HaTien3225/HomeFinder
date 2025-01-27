import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Text, Touchable, TouchableOpacity, View } from "react-native"
import { Button, TextInput, HelperText } from "react-native-paper";
import MyStyles from "../../styles/MyStyles"
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const [user, setUser] = useState({});
    const [imageUris, setImageUris] = useState([]);  // Lưu ảnh của chủ nhà trọ
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);

    const users = {
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "email": {
            "title": "email",
            "field": "email",
            "secureTextEntry": false
        }, "avatar": {
            "title": "Chọn Tệp ",
            "field": "Chọn Tệp ",
        }, "role": {
            "title": "Vai Trò ",
            "field": "role",
        }, "Phone Number": {
            "title": "Số Điện Thoại ",
            "field": "Phone Number",
            "secureTextEntry": false
        }
    }
   

    const change = (value, field) => {
        setUser({...user, [field]: value});
    }

    const pickImage = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setImageUris([...imageUris, result.assets[0]]);
        }
    }

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            let form = new FormData();

            // Gửi các trường người dùng vào form data
            for (let key in user)
                if (key !== 'confirm') {
                    if (key === 'avatar') {
                        form.append('avatar', {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        })
                    } else {
                        form.append(key, user[key]);
                    }
                }

            console.info(form)

             // Thêm ảnh cho chủ nhà trọ
             imageUris.forEach((image, index) => {
                form.append(`room_image_${index}`, {
                    uri: image.uri,
                    name: image.fileName,
                    type: image.type
                });
            });

                
            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data)
                nav.navigate("login");
            } catch (ex) {
                console.error(JSON.stringify(ex));
            } finally {
                setLoading(false);
            }
        }
    }
    
    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <HelperText type="error" visible={err}>
                Mật khẩu KHÔNG khớp
                </HelperText>
            
                {Object.values(users).map(u => <TextInput secureTextEntry={u.secureTextEntry} key={u.field} value={user[u.field]} onChangeText={t => change(t, u.field)} 
                style={MyStyles.margin} placeholder={u.title} right={<TextInput.Icon icon={u.icon} />} />)}

                <TouchableOpacity onPress={pickImage}>
                    <Text style={MyStyles.margin}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>

                {user.avatar ? <Image source={{ uri: user.avatar.uri }} style={{ width: 100, height: 100 }} /> : ""}

                <Button loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    );
}

export default Register;