import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import BackHeader from '../../../Components/Header/BackHeader';
import { useTheme } from '../../../../ThemeContext';
import { FONTS } from '../../../Constants/Fonts';
import { moderateScale } from '../../../Constants/PixelRatio';
import NavigationService from '../../../Services/Navigation';
import AuthService from '../../../Services/Auth';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen');

const FPLogin = () => {
    const { colors } = useTheme();
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };


    const [Phone, setPhone] = useState('')
    const [buttonLoader, setButtonLoader] = useState(false);

    const getForgetPasswardLogin = async () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!Phone) {
          Toast.show('Enter Your Mobile Number');
          return;
        }
        if (!phoneRegex.test(Phone)) {
            Toast.show('Enter a valid 10-digit Mobile Number');
            return;
        }
        const data = {
            "phone": Phone,
        }
        try {
            setButtonLoader(true);
            const res = await AuthService.setForgetPassword(data)
            console.log('forgoerrrrrrrrrrrrrrrrrrrrrrrpassss', res);

            if (res?.status === true) {
                NavigationService.navigate('FPOtp', { dataOtp: res?.data })
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
                <Text style={{ ...styles.title_txt, color: colors.primaryFontColor }}>Forgot Password</Text>
                <Text style={{ ...styles.subtitle_txt, color: colors.subFontcolor }}>
                    Select which contact details should we use to reset your password
                </Text>

                <TextInput
                    placeholder='Email or Phone Number'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='number-pad'
                    value={Phone}
                    onChangeText={(val) => setPhone(val)}
                />

                {/* <Pressable
                    onPress={() => handleOptionSelect('sms')}
                    style={{
                        ...styles.viaView,
                        backgroundColor: '#FFFBE7',
                        borderColor: selectedOption === 'sms' ? '#FEC400' : 'rgba(255, 241, 177, 1)',
                    }}>
                    <View style={{ ...styles.circle, borderColor: colors.buttonColor }}>
                        <Image source={require('../../../assets/images/sms.png')} style={styles.icon} />
                    </View>
                    <View style={{ marginLeft: moderateScale(10) }}>
                        <Text style={{ ...styles.optionText, color: colors.subFontcolor }}>Via SMS</Text>
                        <Text style={{ ...styles.detailText, color: colors.tintText }}>***** ***90</Text>
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => handleOptionSelect('email')}
                    style={{
                        ...styles.viaView,
                        backgroundColor: '#FFFBE7',
                        borderColor: selectedOption === 'email' ? '#FEC400' : 'rgba(255, 241, 177, 1)',
                    }}>
                    <View style={{ ...styles.circle, borderColor: colors.buttonColor }}>
                        <Image source={require('../../../assets/images/email.png')} style={styles.icon} />
                    </View>
                    <View style={{ marginLeft: moderateScale(10) }}>
                        <Text style={{ ...styles.optionText, color: colors.subFontcolor }}>Via Email</Text>
                        <Text style={{ ...styles.detailText, color: colors.tintText }}>***** ******@gmail.com</Text>
                    </View>
                </Pressable> */}




                <TouchableOpacity
                    onPress={() => getForgetPasswardLogin()}
                    style={{ ...styles.button, backgroundColor: colors.buttonColor }}>
                    {buttonLoader ? (
                        <ActivityIndicator size="small" color={'#fff'} />
                    ) : (
                        <Text style={{ ...styles.buttonText, color: colors.secondaryThemeColor }}>Continue</Text>
                    )}

                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    title_txt: {
        textAlign: 'center',
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(16),
    },
    subtitle_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginTop: moderateScale(10),
        width: '65%',
        textAlign: 'center',
        alignSelf: 'center',
    },
    viaView: {
        width: width - moderateScale(34),
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: moderateScale(3),
        marginTop: moderateScale(25),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
        padding: moderateScale(10),
    },
    circle: {
        height: moderateScale(40),
        width: moderateScale(40),
        borderRadius: moderateScale(20),
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    icon: {
        height: moderateScale(34),
        width: moderateScale(34),
    },
    optionText: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(11),
        marginTop: moderateScale(4),
    },
    detailText: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14),
    },
    button: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(200),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
    },
    buttonText: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold,
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
});

export default FPLogin;
