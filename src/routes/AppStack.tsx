import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Home from '../screens/Home';
import History from '../screens/History';
import Profile from "../screens/Profile"
import  Ionicons from 'react-native-vector-icons/Ionicons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
export type RootStackParamAppList = {
    Home:undefined,
    History:undefined,
    Profile:undefined
}

const Tab = createBottomTabNavigator<RootStackParamAppList>();

export function  AppStack(){
    return (
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center',headerShown:false }}>
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

    )
}