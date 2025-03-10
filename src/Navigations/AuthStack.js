//import liraries
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Splash from '../Screens/Auth/Splash';
import Login from '../Screens/Auth/Login';
import LoginScreen from '../Screens/Auth/LoginScreen';
import LoginOtp from '../Screens/Auth/LoginOtp';
import Profile from '../Screens/Auth/Profile';
import FPLogin from '../Screens/Auth/ForgetPassword/FPLogin';
import FPOtp from '../Screens/Auth/ForgetPassword/FPOtp';
import ForgetPassword from '../Screens/Auth/ForgetPassword/ForgetPassword';
import SignUp from '../Screens/Auth/SignUp';



const Stack = createStackNavigator();
// create a component
const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Splash'
            screenOptions={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
            }}
        >
           <Stack.Screen name="Splash" component={Splash} />
           <Stack.Screen name="Login" component={Login} />
           <Stack.Screen name="LoginScreen" component={LoginScreen} />
           <Stack.Screen name="LoginOtp" component={LoginOtp} />
           <Stack.Screen name="SignUp" component={SignUp} />
           <Stack.Screen name="FPLogin" component={FPLogin} />
           <Stack.Screen name="FPOtp" component={FPOtp} />
           <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        </Stack.Navigator>
    );
};

export default AuthStack;
