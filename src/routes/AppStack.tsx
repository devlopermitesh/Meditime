import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from '../screens/Home';
import History from '../screens/History';
import Profile from "../screens/Profile"
import  Ionicons from 'react-native-vector-icons/Ionicons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddMedication from '../screens/AddMedition';
import TakeMedicine from '../screens/TakeMedicine';
import { useContext, useEffect } from 'react';
import { requestUserPermission, setupOnMessageListener } from '../firebasenotificationSetup';
import { AppwriteContext } from '../Appwrite/AppwriteContext';
import { useUser } from '../Store/users';
export type RootStackParamAppList = {
    Home:undefined,
    History:undefined,
    Profile:undefined,
    AddMedication:undefined,
    Tabs: undefined, 
    TakeMedicine:{ID:string}
}
const Tab = createBottomTabNavigator<RootStackParamAppList>();
const Stack = createNativeStackNavigator< RootStackParamAppList>();

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: 'center', headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="History" 
        component={History} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppStack() {
  const {appwrite}=useContext(AppwriteContext)
  const {user}=useUser()
  useEffect(() => {
    requestUserPermission().then(async(token) => {
      if (token) {
        console.log("FCM Token:", token);
        await appwrite.SelectTarget(user.Id,token)
      }
    });

    setupOnMessageListener();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false,headerBackButtonDisplayMode:'default' }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="AddMedication" component={AddMedication} />
      <Stack.Screen name="TakeMedicine" component={TakeMedicine} />
    </Stack.Navigator>
  );
}