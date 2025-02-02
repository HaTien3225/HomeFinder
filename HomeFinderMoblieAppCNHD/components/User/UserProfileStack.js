import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from './Profile';  
import RegisterHost from '../Home/RegisterHost';  
import CreateListing from '../Home/CreateListing';  
import PostNotificationScreen from '../Home/PostNotificationScreen'; 
import { MyUserContext } from '../../configs/MyUserContext';

const Stack = createStackNavigator();

const UserProfileStack = () => {
    const user = useContext(MyUserContext);  

    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{ title: "Thông tin cá nhân" }}
            />
            {user?.role === "tenant" && (
                <>
                    <Stack.Screen
                        name="PostNotificationScreen"
                        component={PostNotificationScreen}
                        options={{ title: "Đăng tin tìm phòng" }}
                    />
                    <Stack.Screen
                        name="RegisterHost"
                        component={RegisterHost}options={{ title: "Đăng ký làm chủ trọ" }}
                    />
                </>
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
