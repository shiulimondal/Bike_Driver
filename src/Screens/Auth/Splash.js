//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';

const { height, width } = Dimensions.get('screen')
// create a component
const Splash = () => {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />
            <Image source={require('../../assets/images/logo.png')} style={styles.logo_sty} />

            <Image source={require('../../assets/images/carsolash.png')} style={styles.carlogo_sty} />

            <Text style={{ ...styles.title_txt, color: colors.primaryFontColor }}>They are always there</Text>

            <Text style={{ ...styles.subtitle_txt, color: colors.tintText }}>We reach you anywhere , anytime and at the lowest prices</Text>

            <TouchableOpacity
                onPress={() => NavigationService.navigate('Login')}
                style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Start Now</Text>
            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    logo_sty: {
        height: moderateScale(90),
        width: moderateScale(90),
        marginTop: moderateScale(100),
    },
    carlogo_sty:{
        height: moderateScale(250),
        width: moderateScale(250),
        marginTop: moderateScale(50),
        resizeMode:'contain'
    },
    title_txt: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(15),
        marginTop: moderateScale(20)
    },
    subtitle_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginTop: moderateScale(10),
        width: '75%',
        textAlign: 'center'
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
});

//make this component available to the app
export default Splash;
