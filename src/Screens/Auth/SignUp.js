//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Image } from 'react-native';
import BackHeader from '../../Components/Header/BackHeader';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import Icon from '../../Ui/Icon';
import NavigationService from '../../Services/Navigation';
import CheckBox from '../../Ui/CheckBox';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../Services/Auth';
import Modal from 'react-native-modal';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const SignUp = () => {
    const { colors } = useTheme();
    const route = useRoute();
    const userData = route.params.dataOtp
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(userData);
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [passwordCnf, setPasswordCnf] = useState('')
    const [showPasswordCnf, setShowPasswordCnf] = useState(false);
    const [check, setCheck] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };


    const getUserReg = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name.trim()) {
            Toast.show('Enter Your Name');
            return;
        }
        if (!email.trim()) {
            Toast.show('Enter Your Email');
            return;
        }

        if (!emailRegex.test(email)) {
            Toast.show('Enter a valid Email Address');
            return;
        }

        if (!userData.trim()) {
            Toast.show('Enter Your Mobile Number');
            return;
        }
        if (!password.trim()) {
            Toast.show('Enter Your Password');
            return;
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('phone', userData)
        formData.append('password', password)
       
        console.log('FormDatatosend:============================', formData);

        try {
            setButtonLoader(true);
            const res = await AuthService.setRegister(formData)
            console.log('Registrationres========================', res)
            if (res?.status === true) {
                setModalVisible(true)
                setTimeout(() => {
                    setModalVisible(false)
                    NavigationService.navigate('Login')
                }, 2000)

            } else {
                Toast.show(res?.message);
                console.log('Registration failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error in getUserReg:', error);
        } finally {
            setButtonLoader(false)
        }
    };

    return (
        <View style={styles.container}>
            <BackHeader />
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <ScrollView>
                <Text style={{ ...styles.title_txt, color: colors.primaryFontColor }}>Sign-Up with Your Email & Phone No.</Text>
                <TextInput
                    placeholder='Name'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    value={name}
                    keyboardType='numbers-and-punctuation'
                    onChangeText={(val) => setName(val)}
                />

                <TextInput
                    placeholder='Phone Number'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    editable={false}
                    keyboardType='numbers-and-punctuation'
                    value={phone}
                    onChangeText={(val) => setPhone(val)}
                   
                />


                <TextInput
                    placeholder='Email Id'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='email-address'
                    value={email}
                    onChangeText={(val) => setEmail(val)}
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

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: moderateScale(15),
                    marginTop: moderateScale(15)
                }}>
                    <CheckBox
                        checked={check}
                        onChange={(val) => setCheck(val)}
                        size={18}
                    />
                    <Text
                        onPress={() => NavigationService.navigate('FPLogin')}
                        style={styles.forget_password}>I Accept the <Text style={{ color: colors.buttonColor }}>Terms & Conditions</Text> </Text>

                </View>

                <TouchableOpacity
                    onPress={() => getUserReg()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Submit</Text>
                    )}
                </TouchableOpacity>

                <Text
                    onPress={() => NavigationService.navigate('Login')}
                    style={{ ...styles.noaccount_txt, color: colors.tintText }}>Don’t have an account?
                    <Text style={{ color: colors.buttonColor }}> Sign In</Text></Text>
            </ScrollView>


            
            <Modal
                isVisible={isModalVisible}
                // backdropOpacity={1}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <Image source={require('../../assets/images/success.png')} style={styles.success_img} />
                    <Text style={{ ...styles.model_msg, color: colors.primaryFontColor }}>Congratulations</Text>
                    <Text style={{ ...styles.model_submsg, color: colors.subFontcolor }}>Your account is ready to use. You will be redirected to the Home Page in a few seconds.</Text>
                    <Image source={require('../../assets/images/logo.png')} style={styles.logo_img} />
                </View>
            </Modal>

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
        fontSize: moderateScale(16),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(20),
        maxWidth: '70%'
    },
    input_sty: {
        borderWidth: 1,
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(10),
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
        marginTop: moderateScale(10),
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
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginHorizontal: moderateScale(10),
        color: '#5A5A5A'
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
    modalView: {
        height: '45%',
        width: '80%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: moderateScale(15),
        padding: moderateScale(20)
    },
    success_img: {
        height: moderateScale(100),
        width: moderateScale(100)
    },
    model_msg: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(16),
        marginTop: moderateScale(15)
    },
    model_submsg: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(11),
        marginTop: moderateScale(15),
        textAlign: 'center'
    },
    logo_img: {
        height: moderateScale(45),
        width: moderateScale(45),
        marginTop: moderateScale(25)
    },
});

//make this component available to the app
export default SignUp;
