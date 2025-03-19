//import liraries
import React, { Component, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import BackHeader from '../../Components/Header/BackHeader';
import OTPTextInput from 'react-native-otp-textinput';
import { useTheme } from '../../../ThemeContext';
import NavigationService from '../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../Services/Auth';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const LoginOtp = () => {
    const { colors } = useTheme()
    const route = useRoute()
    const userId = route.params?.dataId

    const [otp, setOtp] = useState(['', '', '', '', ''])
    const [buttonLoader, setButtonLoader] = useState(false)
    const inputRefs = useRef([])

    // const handleOtpChange = (value, index) => {
    //     const updatedOtp = [...otp]
    //     updatedOtp[index] = value
    //     setOtp(updatedOtp)
    //     if (value && index < otp.length - 1) {
    //         inputRefs.current[index + 1]?.focus()
    //     }
    //     else if (!value && index > 0) {
    //         inputRefs.current[index - 1]?.focus()
    //     }
    // };

    const handleOtpChange = (value, index) => {
        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (event, index) => {
        if (event.nativeEvent.key === 'Backspace') {
            if (otp[index] === '' && index > 0) {
                const updatedOtp = [...otp];
                updatedOtp[index - 1] = '';
                setOtp(updatedOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const getOTPLogin = async () => {
        const otpData = otp.join('')
        if (!otpData) {
            Toast.show('Enter OTP');
            return;
        }

        const data = {
            "phone": userId,
            "otp": otpData,
        }
        try {
            setButtonLoader(true);

            const res = await AuthService.setEmailOtp(data)

            if (res?.status === true) {
                NavigationService.navigate('SignUp', { dataOtp: res?.data })
                Toast.show(res?.message);
            } else {
                Toast.show(res?.message);
            }
        } catch (error) {
            console.log('Error777', error)
        } finally {
            setButtonLoader(false)
        }
    };

    return (
        <View style={styles.container}>
            <BackHeader />
            <Text style={styles.title_txt}>Phone Verification</Text>
            <Text style={styles.sub_title_txt}>
                {`Enter the 5-digit code sent to you at ${userId}.`}
            </Text>

            <View style={styles.inputContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={{
                            ...styles.otp_sty,
                            backgroundColor: digit ? colors.inputBox : colors.cardColor,
                            color: colors.primaryFontColor,
                            borderColor: digit ? colors.inputBorder : colors.borderColor,
                        }}
                        value={digit}
                        maxLength={1}
                        keyboardType="numeric"
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(event) => handleKeyPress(event, index)}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        textAlign="center"
                    />
                ))}
            </View>

            <Text style={{ ...styles.noaccount_txt, color: colors.tintText }}>
                Didn’t receive the code?
                <Text style={{ color: colors.buttonColor }}> Resend again</Text>
            </Text>

            <TouchableOpacity
                onPress={getOTPLogin}
                style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}
            >
                {buttonLoader ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>
                        Next
                    </Text>
                )}
            </TouchableOpacity>
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
        color: '#000',
        textAlign: 'center',
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(16)
    },
    sub_title_txt: {
        color: '#999',
        textAlign: 'center',
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        maxWidth: '60%',
        alignSelf: 'center',
        marginTop: moderateScale(10)
    },
    inputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: moderateScale(250),
        justifyContent: 'space-between',
        marginTop: moderateScale(25)
    },
    otp_sty: {
        borderWidth: 1,
        borderRadius: moderateScale(5),
        width: moderateScale(45),
        height: moderateScale(45),
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(15)
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
        marginTop: moderateScale(15)
    }
});

//make this component available to the app
export default LoginOtp;
