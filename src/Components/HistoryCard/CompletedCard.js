//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';

// create a component
const CompletedCard = () => {
    const { colors } = useTheme();
    return (
        <View style={{
            ...styles.container, borderColor: colors.inputBorder,
            backgroundColor: colors.inputBox
        }}>
            <View style={styles.main_view}>
                <Text style={{ ...styles.user_name, color: colors.tintText }}>Nate Samson</Text>
            </View>
            <View style={styles.main_view}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/saletime.png')} style={styles.calender_img} />
                    <Text style={{ ...styles.time_txt, color: colors.primaryFontColor }}>08 Aug 24 | 7:10 PM</Text>
                </View>

                <Text style={{ ...styles.trip_txt, fontSize: moderateScale(12), color: colors.tintText }}>₹ 220.00</Text>
            </View>

            
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        marginHorizontal: moderateScale(15),
        padding: moderateScale(10),
        borderWidth: 1,
        borderRadius: moderateScale(10),
        marginTop: moderateScale(10),
        //    elevation:2
    },
    main_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: moderateScale(5)
    },
    user_name: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14)
    },
    trip_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    calender_img: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    time_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginLeft: moderateScale(7)
    }
});

//make this component available to the app
export default CompletedCard;
