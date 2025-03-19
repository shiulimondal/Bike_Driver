//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import BackHeader from '../../Components/Header/BackHeader';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import Icon from '../../Ui/Icon';
import NavigationService from '../../Services/Navigation';
import AuthService from '../../Services/Auth';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const LoginScreen = () => {
    const { colors } = useTheme();
    const [Phone, setPhone] = useState('')
    const [buttonLoader, setButtonLoader] = useState(false);

    const getEmailLogin = async () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!Phone) {
          Toast.show('Enter Your Mobile Number');
          return;
        }
        if (!phoneRegex.test(Phone)) {
            Toast.show('Enter a valid 10-digit Mobile Number');
            return;
        }
        const data = { "phone": Phone };

        try {
            setButtonLoader(true);
            const res = await AuthService.setEmail(data);
            console.log('resssssssssssssssssssssssss',res);
            if (res?.status === true) {
                NavigationService.navigate('LoginOtp', { dataId: res?.data });
            } else {
                Toast.show(res?.message);
                // Toast.show(res?.message || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error:=============================', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        } finally {
            setButtonLoader(false);
            console.error('Error in getEmailLogin:=============================', error);
        }
    };


    return (
        <View style={styles.container}>
            <BackHeader />
            <ScrollView>
                <Text numberOfLines={2} style={{ ...styles.title_txt, color: colors.primaryFontColor }}>
                    What's your Phone number or email?
                </Text>
                <TextInput
                    placeholder='Enter Your Phone'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    maxLength={10}
                    keyboardType='number-pad'
                    textAlign='center'
                    value={Phone}
                    onChangeText={(val) => setPhone(val)}

                />

                <TouchableOpacity
                    onPress={() => getEmailLogin()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>

                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Next</Text>
                    )}
                </TouchableOpacity>

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
        fontFamily: FONTS.Poppins.bold,
        fontSize: moderateScale(17),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(20),
        width: '73%'
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

    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(30),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(150)
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
    }
});

//make this component available to the app
export default LoginScreen;
