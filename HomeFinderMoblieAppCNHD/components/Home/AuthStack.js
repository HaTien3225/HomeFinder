import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../User/Login";
import Register from "../User/Register";
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="login" component={Login} options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="register" component={Register} options={{ title: "Đăng kí" }} />
    </Stack.Navigator>
  );
};

export default AuthStack;
