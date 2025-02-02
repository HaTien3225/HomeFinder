// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PostNotificationScreen from './PostNotificationScreen';
import Home from './Home';


const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Trang Chủ" component={Home} />
    <Tab.Screen name="Đăng Thông Báo" component={PostNotificationScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
