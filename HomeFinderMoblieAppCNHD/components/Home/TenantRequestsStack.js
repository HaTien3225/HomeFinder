import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TenantRequestsScreen from "./TenantRequestsScreen";
import RequestDetailScreen from "./RequestDetailScreen";

const Stack = createNativeStackNavigator();

const TenantRequestsStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="TenantRequests" component={TenantRequestsScreen} options={{ title: "Danh sách tìm phòng" }} />
    <Stack.Screen name="RequestDetailScreen" component={RequestDetailScreen} options={{ title: "Chi tiết yêu cầu" }} />
  </Stack.Navigator>
);

export default TenantRequestsStack;
