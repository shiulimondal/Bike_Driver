import 'react-native-gesture-handler';
// import 'react-native-reanimated';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NavigationService from './src/Services/Navigation';
import AuthStack from './src/Navigations/AuthStack';
import UserStack from './src/Navigations/UserStack';
import { ThemeProvider, useTheme } from './ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from './src/Services/Auth';
import { setUser } from './src/Redux/reducer/User';


const Stack = createStackNavigator();

const App = () => {
  const dispatch = useDispatch();
  const { login_status } = useSelector((state) => state.User || {})  
  console.log('login_status---------------------------------',login_status);
  
  const [activeUser, setActiveUser] = useState('');

  useEffect(() => {
    checkUser();
  }, []);



  const checkUser = async () => {
    try {
      const result = await AuthService.getAccount();
      if (result) {
        console.log('Active user:-------------------------------------', result);
        setActiveUser(result);
        dispatch(setUser(result));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemeContent login_status={login_status} />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const ThemeContent = ({ login_status }) => {
  const { colors } = useTheme();
  const navigatorRef = useRef(null);

  return (
    <NavigationContainer
      ref={(ref) => {
        navigatorRef.current = ref;
        NavigationService.setTopLevelNavigator(ref);
      }} 
    >
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {login_status === true ? (
            <Stack.Screen name="UserStack" component={UserStack} />
          ) : (
            <Stack.Screen name="AuthStack" component={AuthStack} />
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default App;
