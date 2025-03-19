//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import BackHeader from '../../Components/Header/BackHeader';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';
import Icon from '../../Ui/Icon';
import HomeService from '../../Services/HomeServises';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const ChangePassword = () => {
    const { colors } = useTheme();
    const [MyProfile, setMyProfile] = useState([])

    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const [passwordNew, setPasswordNew] = useState('')
    const [showPasswordNew, setShowPasswordNew] = useState(false);

    const [passwordCnf, setPasswordCnf] = useState('')
    const [showPasswordCnf, setShowPasswordCnf] = useState(false);
        const [buttonLoader, setButtonLoader] = useState(false)

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            const res = await HomeService.setUserProfile()
            // console.log('ressssssssssssssssssssssssssuser-----------------------------------', res);
            if (res?.status === true) {
                setMyProfile(res?.data)
            }
        } catch (error) {
            // console.log('Error in profileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    };

    const getChangePassword = async () => {
        // Define the data object first
        const data = {
            old_password: password,
            password: passwordNew,
            password_confirmation: passwordCnf
        };
    
        // // Manual validation
        if (!data.old_password) {
            return Toast.show('Old password is required');
        }
        if (!data.password) {
            return Toast.show('New password is required');
        }
        if (data.password.length < 6) {
            return Toast.show('Password must be at least 6 characters long');
        }
        if (!data.password_confirmation) {
            return Toast.show('Password confirmation is required');
        }
        if (data.password !== data.password_confirmation) {
            return Toast.show('Passwords must match');
        }
    
        console.log('psssssssssssssssssssssssssssssss------------------', data);
    
        try {
            setButtonLoader(true);
            const res = await HomeService.setChangePassword(data);
    
            if (res?.status === true) {
                NavigationService.navigate('Home');
                Toast.show(res.message)
                console.log('rrrrs------------------', res.message);
            }else{
                console.log('rrrrrrrrrrrrrrrrrrrrrrrrrs------------------', res.message);
                Toast.show(res.message)
            }
        } catch (error) {
            console.log('Error777-------------------', error);
        } finally {
            setButtonLoader(false);
        }
    };
    
    


    return (
        <View style={styles.container}>
            <BackHeader />
            <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ ...styles.imgcircle, backgroundColor: colors.primaryThemeColor }}>
                        <Image
                            source={{ uri: MyProfile?.image_path }}
                            // source={require('../../assets/images/uuuu.png')} 
                            style={styles.user_img} />

                    </View>

                    <Text style={{ ...styles.user_name_txt, color: colors.tintText }}>{MyProfile?.name}</Text>
                    <Text style={{ ...styles.user_email, color: colors.tintText }}>{MyProfile?.email}</Text>

                    <Text style={{ ...styles.upload_txt, color: colors.secondaryFontColor }}>Change a password</Text>
                </View>

                <View style={{
                    ...styles.passwoard_view,
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>
                    <TextInput
                        placeholder='Enter Your old Password'
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
                        placeholder='Enter Your New Password'
                        placeholderTextColor={colors.borderColor}
                        style={{
                            ...styles.Password_input_sty,
                            color: colors.primaryFontColor
                        }}
                        keyboardType='numbers-and-punctuation'
                        value={passwordNew}
                        onChangeText={(val) => setPasswordNew(val)}
                        secureTextEntry={!showPasswordNew}
                    />
                    <TouchableOpacity onPress={() => setShowPasswordNew(!showPasswordNew)}>
                        <Icon
                            name={showPasswordNew ? 'eye' : 'eye-off'}
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
                    onPress={() => getChangePassword()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Submit</Text>
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
    imgcircle: {
        height: moderateScale(52),
        width: moderateScale(52),
        borderRadius: moderateScale(40),
        alignContent: 'center',
        justifyContent: 'center',
        elevation: moderateScale(4)
    },
    user_img: {
        height: moderateScale(50),
        width: moderateScale(50),
        borderRadius: moderateScale(25),
        resizeMode: 'cover'
    },
    user_name_txt: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(14),
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(5)
    },
    user_email: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(2),
        paddingHorizontal: moderateScale(5)
    },
    upload_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        textAlign: "center",
        marginTop: moderateScale(7)
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
export default ChangePassword;
