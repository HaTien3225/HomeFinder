// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PostNotificationScreen from '../screens/PostNotificationScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Trang Chủ" component={HomeScreen} />
    <Tab.Screen name="Đăng Thông Báo" component={PostNotificationScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
