//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../ThemeContext';
import BackHeader from '../../../Components/Header/BackHeader';
import { FONTS } from '../../../Constants/Fonts';
import { moderateScale } from '../../../Constants/PixelRatio';
import Icon from '../../../Ui/Icon';
import NavigationService from '../../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../../Services/Auth';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const ForgetPassword = () => {
    const { colors } = useTheme();
    const route = useRoute()
    const userId = route.params?.getData
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCnf, setPasswordCnf] = useState('')
    const [showPasswordCnf, setShowPasswordCnf] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false)


    const getResetPassword = async () => {
        const data = {
            "email": userId,
            "password": password,
            "password_confirmation":passwordCnf

        }
        try {
            setButtonLoader(true);

            const res = await AuthService.setResetPassword(data)

            if (res?.status === true) {
                NavigationService.navigate('Login')
            } else {
                console.error('Error:', res?.message || 'OTP validation failed.')
            }
        } catch (error) {
            console.error('Error777', error)
        } finally {
            setButtonLoader(false)
        }
    };

    return (
        <View style={styles.container}>
             <BackHeader />
             <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{...styles.title_txt,color: colors.primaryFontColor}}>Set New password</Text>
            <Text style={{ ...styles.subtitle_txt, color: colors.subFontcolor }}>
            Set your new password
                </Text>

                <View style={{
                    ...styles.passwoard_view,
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>
                    <TextInput
                        placeholder='Enter Your New Password'
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


                <View style={{
                    ...styles.passwoard_view,
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>
                    <TextInput
                        placeholder='Confirm Password'
                        placeholderTextColor={colors.borderColor}
                        style={{
                            ...styles.Password_input_sty,
                            color: colors.primaryFontColor
                        }}
                        keyboardType='numbers-and-punctuation'
                        secureTextEntry={!showPasswordCnf}
                        value={passwordCnf}
                        onChangeText={(val) => setPasswordCnf(val)}
                    />
                    <TouchableOpacity onPress={() => setShowPasswordCnf(!showPasswordCnf)}>
                        <Icon
                            name={showPasswordCnf ? 'eye' : 'eye-off'}
                            type="Feather"
                            color={colors.secondaryFontColor}
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
               

                <TouchableOpacity
                    onPress={() => getResetPassword()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.signin_txt,color:colors.secondaryThemeColor }}>Save</Text>
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
    title_txt:{
        textAlign: 'center',
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(16)
    },
    subtitle_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginTop: moderateScale(10),
        width: '65%',
        textAlign: 'center',
        alignSelf: 'center',
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
    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(70),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
});

//make this component available to the app
export default ForgetPassword;
