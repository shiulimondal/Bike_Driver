import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';

const { height, width } = Dimensions.get('screen')
const OtpModalCard = ({ bookData, getOtpSubmit, setOtpModal }) => {
    const { colors } = useTheme();
    console.log('------------------------------BookingData---------------------incompo', bookData);


    const handleSubmit = () => {
        getOtpSubmit(bookData?.data?.id, otp);
        setOtpModal(false);
    };

    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
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



    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/uuuu.png')} style={styles.user_img} />
                    <Text style={{ ...styles.user_name, color: colors.primaryFontColor }}>{bookData?.data?.customer_name}</Text>
                </View>
                <Image source={require('../../assets/images/phone_call.png')} style={styles.call_img} />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                <Image source={require('../../assets/images/location.png')} style={styles.location_pin_img} />
                <Text style={{ ...styles.pic_up_txt, color: colors.primaryFontColor }}>Pick Up</Text>
            </View>
            <Text style={{ ...styles.location_txt, color: colors.tintText }}>{bookData?.data?.pickup_location}</Text>

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

            <TouchableOpacity onPress={() => handleSubmit()}
                style={{ ...styles.pickbutton_sty, backgroundColor: colors.buttonColor }}>
                <Text style={{ ...styles.pickup_txt, color: colors.secondaryThemeColor }}>Start Trip</Text>

            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: moderateScale(30),
        // paddingHorizontal: moderateScale(15)
    },
    user_img: {
        height: moderateScale(60),
        width: moderateScale(60),
        resizeMode: 'contain',
    },
    user_name: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13),
        marginLeft: moderateScale(10)
    },
    call_img: {
        height: moderateScale(40),
        width: moderateScale(40),
        tintColor: '#FEC400',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    location_pin_img: {
        height: moderateScale(20),
        width: moderateScale(20),
        resizeMode: 'contain',
    },
    pic_up_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(10)
    },
    location_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(10)
    },
    inputContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: moderateScale(200),
        justifyContent: 'space-between',
        marginTop: moderateScale(25)
    },
    otp_sty: {
        borderWidth: 1,
        borderRadius: moderateScale(5),
        width: moderateScale(38),
        height: moderateScale(41),
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(15)
    },
    pickbutton_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(30),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        alignSelf: 'center'
    },
    pickup_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.regular
    },
})

export default OtpModalCard