//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import BackHeader from '../../Components/Header/BackHeader';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import Icon from '../../Ui/Icon';
import NavigationService from '../../Services/Navigation';
import AuthService from '../../Services/Auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../Redux/reducer/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onForegroundEvent, onNotification, onOpenNotification } from '../../Services/Notification/NotifeeService';
import notifee, { EventType } from '@notifee/react-native';
import { fcmService } from '../../Services/Notification/FCMservice';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const Login = () => {
    const dispatch = useDispatch()
    const { colors } = useTheme();
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [Phone, setPhone] = useState('')
    const [buttonLoader, setButtonLoader] = useState(false);
    const [activeUser, setActiveUser] = useState('');
    const [dToken, setDToken] = useState('')

    useEffect(() => {
      checkUser();
    }, []);
  
    useEffect(() => {
      checkUser();
      fcmService.registerAppWithFCM();
      fcmService.register(onRegister, onNotification, onOpenNotification);
      notifee.requestPermission();
      notifee.onForegroundEvent(onForegroundEvent);
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification } = detail;
        if (type == EventType.PRESS) {
          await notifee.cancelNotification(notification.id);
        }
      });
  
      return () => {
        // Clean up FCM service or other listeners if needed
      };
    }, []);
  
  

    function onRegister(Dtoken) {
        console.log("Notification token=======================================", Dtoken);
        setDToken(Dtoken)
    }
  
    const checkUser = async () => {
      try {
        const result = await AuthService.getAccount();
        if (result) {
          // console.log('Active user:', result);
          setActiveUser(result);
          dispatch(setUser(result));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };


    const getUserLogin = async () => {
        if (!Phone.trim()) {
            Toast.show('Enter Your Phone Number');
            return;
        }
        if (!password.trim()) {
            Toast.show('Enter Your Password');
            return;
        }
        const data = {
            "phone": Phone,   
            "password": password,
            "device_token":dToken
        };
    
        try {
            setButtonLoader(true);
    
            const res = await AuthService.setLogin(data);
            console.log('Response:=========================================', res);
    
            if (res?.status === true) {
                await AsyncStorage.setItem('token', res.token);
                await AsyncStorage.setItem('userData', JSON.stringify(res.data));
                AuthService.setAccount(res.data);
                dispatch(setUser(res.data));
                console.log('Token saved successfully:', res.token);
                Toast.show(res?.message);
            } else {
                // Handle login failure
                Toast.show(res?.message);
                // Toast.show(res?.message || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error in getUserLogin:', error);
            // Toast.show('An unexpected error occurred. Please try again later.');
        } finally {
            setButtonLoader(false);
        }
    };
    
    return (
        <View style={styles.container}>
            {/* <BackHeader /> */}
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <ScrollView>
                <Text style={{ ...styles.title_txt, color: colors.primaryFontColor }}>Sign in</Text>
                <TextInput
                    placeholder='Enter Phone Number'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='number-pad'
                    maxLength={10}
                    value={Phone}
                    onChangeText={(val) => setPhone(val)}
                />

                <View style={{
                    ...styles.passwoard_view,
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>
                    <TextInput
                        placeholder='Password'
                        placeholderTextColor={colors.borderColor}
                        style={{
                            ...styles.Password_input_sty,
                            color: colors.primaryFontColor
                        }}
                        keyboardType='numbers-and-punctuation'
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'eye' : 'eye-off'}
                            type="Feather"
                            color={colors.secondaryFontColor}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>

                <Text
                    onPress={() => NavigationService.navigate('FPLogin')}
                    style={styles.forget_password}>Forget Password ?</Text>

                <TouchableOpacity
                    onPress={() => getUserLogin()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Next</Text>
                    )}
                </TouchableOpacity>

                <Text
                    onPress={() => NavigationService.navigate('LoginScreen')}
                    style={{ ...styles.noaccount_txt, color: colors.tintText }}>Don’t have an account?
                    <Text style={{ color: colors.buttonColor }}> Sign Up</Text></Text>
            </ScrollView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    title_txt: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(17),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(30)
    },
    input_sty: {
        borderWidth: 1,
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(30),
        height: moderateScale(48),
        borderRadius: moderateScale(7),
        paddingHorizontal: moderateScale(10),
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    passwoard_view: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        borderWidth: 1,
        borderRadius: moderateScale(7),
        marginTop: moderateScale(20),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    Password_input_sty: {
        height: moderateScale(44),
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13),
        width: moderateScale(290),
        borderRadius: moderateScale(7),
        paddingHorizontal: moderateScale(10),
    },
    forget_password: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(15),
        color: 'red'
    },
    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(30),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
    noaccount_txt: {
        textAlign: 'center',
        fontSize: moderateScale(12),
        fontFamily: FONTS.Poppins.semibold,
        marginTop: moderateScale(70)
    },
    
});

//make this component available to the app
export default Login;
