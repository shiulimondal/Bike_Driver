import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from '../Constants/Colors';
import { View, Image, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../Constants/PixelRatio';
import Home from '../Screens/Home/Home';
import Profile from '../Screens/Profile/Profile';
import History from '../Screens/History/History';
import { FONTS } from '../Constants/Fonts';

const Bottom = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Bottom.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.buttonColor,
                tabBarInactiveTintColor: '#333333',
                tabBarStyle: {
                    backgroundColor: Colors.backgroundColor,
                    height: moderateScale(60),
                    paddingTop:moderateScale(15),
                    borderTopLeftRadius:moderateScale(30),
                    borderTopRightRadius:moderateScale(30)
                },
            }}
        >
            <Bottom.Screen
                name="Home"
                component={Home}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <Image
                                source={require('../assets/images/house.png')}
                                resizeMode='contain'
                                style={[
                                    styles.tabIcon,
                                    {
                                        tintColor: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.tabLabel,
                                    {
                                        color: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            >
                                HOME
                            </Text>
                        </View>
                    ),
                }}
            />
            <Bottom.Screen
                name="Profile"
                component={Profile}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <Image
                                source={require('../assets/images/user.png')}
                                resizeMode='contain'
                                style={[
                                    styles.tabIcon,
                                    {
                                        tintColor: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.tabLabel,
                                    {
                                        color: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            >
                                PROFILE
                            </Text>
                        </View>
                    ),
                }}
            />
            <Bottom.Screen
                name="History"
                component={History}
                options={{
                    unmountOnBlur: true,
                    tabBarLabel: () => null,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabItem}>
                            <Image
                                source={require('../assets/images/History.png')}
                                resizeMode='contain'
                                style={[
                                    styles.tabIcon,
                                    {
                                        tintColor: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.tabLabel,
                                    {
                                        color: focused ? '#333333' : '#333333',
                                    },
                                ]}
                            >
                                HISTORY
                            </Text>
                        </View>
                    ),
                }}
            />
        </Bottom.Navigator>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width:moderateScale(100)
    },
    tabIcon: {
        height: moderateScale(23),
        width: moderateScale(23),
        marginRight: moderateScale(5), 
    },
    tabLabel: {
        fontSize: moderateScale(10),
        fontFamily:FONTS.Poppins.semibold
    },
});

export default BottomTab;
