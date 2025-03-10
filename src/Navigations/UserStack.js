import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import History from '../Screens/History/History';
import Profile from '../Screens/Profile/Profile';
import Home from '../Screens/Home/Home';
import ChangePassword from '../Screens/DrawerScreen/ChangePassword';
import DocManagement from '../Screens/DrawerScreen/DocManagement';
import Sale from '../Screens/DrawerScreen/Sale';
import CarManagment from '../Screens/DrawerScreen/CarManagment';
import PaymentHistory from '../Screens/DrawerScreen/PaymentHistory';
import NavigatinScreen from '../Screens/DrawerScreen/NavigatinScreen';


const Stack = createStackNavigator();

// create a component
const UserStack = () => {
  const { login_status } = useSelector(state => state.User);
  return (
    <Stack.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown: false,
            }}
        >      
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="DocManagement" component={DocManagement} />
            <Stack.Screen name="Sale" component={Sale} />
            <Stack.Screen name="CarManagment" component={CarManagment} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistory} />


            <Stack.Screen name="NavigatinScreen" component={NavigatinScreen} />
        </Stack.Navigator>
  );
};

export default UserStack;

