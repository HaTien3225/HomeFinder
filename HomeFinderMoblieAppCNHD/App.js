import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home/Home';
import 'moment/locale/vi';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './components/User/Login';
import Register from './components/User/Register';
import { Icon } from 'react-native-paper';
import { MyDispatchContext, MyUserContext } from './configs/MyUserContext';
import { useContext, useReducer } from 'react';
import MyUserReducers from './configs/MyUserReducers';
import UserProfile from './components/User/Profile';
import CreateListing from './components/Home/CreateListing'; // Đảm bảo đã import CreateListing
import RegisterHost from './components/Home/RegisterHost';
import ListingDetail from './components/Home/ListingDetail';
import UserProfileStack from './components/User/UserProfileStack';  // Đảm bảo nhập đúng đường dẫn
import PostNotificationScreen from './components/Home/PostNotificationScreen';
import TenantRequestsScreen from './components/Home/TenantRequestsScreen';
import TenantRequestsStack from './components/Home/TenantRequestsStack';
import AuthStack from './components/Home/AuthStack';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="CreateListing" component={CreateListing} />
      <Stack.Screen name="RegisterHost" component={RegisterHost} />
      <Stack.Screen name="ListingDetail" component={ListingDetail} />
      <Stack.Screen name="PostNotificationScreen" component={PostNotificationScreen} />
      <Stack.Screen name="TenantRequests" component={TenantRequestsScreen} options={{ title: "Danh sách tìm phòng" }} /> 
   

    
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator screenOptions={{headerShown: true}}>
    <Tab.Screen
      name="home"
      component={StackNavigator}
      options={{ title: "Màn hình chính", tabBarIcon: () => <Icon source="home-account" size={20} /> }}
    />
     <Tab.Screen
          name="TenantRequests"
          component={TenantRequestsStack} 
          options={{ title: "Danh sách tìm phòng", tabBarIcon: () => <Icon source="magnify" size={20} /> }}
     />

   
    {user === null ? (
      <>
        <Tab.Screen 
          name="login"
          component={AuthStack}
          options={{ title: "Đăng nhập", headerShown: false, tabBarIcon: () => <Icon source="account-check" size={20} /> }}
        />
        
      </>
    ) : (
      <>
        <Tab.Screen
          name="profile"
          component={UserProfileStack}  // Sử dụng UserProfileStack để bao gồm cả RegisterHost và CreateListing
          options={{ title: "Tài khoản",  headerShown: false, tabBarIcon: () => <Icon source="account-check" size={20} /> }}
        />
        
      </>
    )}
    </Tab.Navigator>

  
  );
}


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducers, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <TabNavigator />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
