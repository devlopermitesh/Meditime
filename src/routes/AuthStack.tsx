import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import { Text } from 'react-native';
import Onboarding from '../screens/Getstart';
export type AuthStackParamList = {
    Onboarding:undefined,
    Login:undefined,
    signup:undefined,
}

const Stack=createNativeStackNavigator<AuthStackParamList>();

export function  AuthStack(){
    // console.log("you are going to see login or signup",Login)
    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign:'center',
            headerShown:false
            
          }} >
            <Stack.Screen name='Onboarding' component={Onboarding}/>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="signup" component={Signup} />
         </Stack.Navigator>
    )
}