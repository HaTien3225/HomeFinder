import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './Profile';  // Đảm bảo rằng bạn đã nhập đúng đường dẫn
import RegisterHost from '../Home/RegisterHost';  // Đảm bảo rằng bạn đã nhập đúng đường dẫn
import CreateListing from '../Home/CreateListing';  // Đảm bảo rằng bạn đã nhập đúng đường dẫn
import { MyUserContext } from '../../configs/MyUserContext';

const Stack = createStackNavigator();

const UserProfileStack = () => {
    const user = useContext(MyUserContext);  // Lấy thông tin người dùng từ context

    return (
        <Stack.Navigator screenOptions={{headerShown: true}}>
            <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ title: "Thông tin chi tiết" }}
            />
            {user?.role === "tenant" && (
                <Stack.Screen
                    name="RegisterHost"
                    component={RegisterHost}
                    options={{ title: "Đăng ký làm chủ trọ" }}
                />
            )}
            {user?.role === "host" && (
                <Stack.Screen
                    name="CreateListing"
                    component={CreateListing}
                    options={{ title: "Đăng tin cho thuê" }}
                />
            )}
        </Stack.Navigator>
    );
};

export default UserProfileStack;
