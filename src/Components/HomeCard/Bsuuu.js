import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Icon from "../../Ui/Icon";
import { moderateScale } from "../../Constants/PixelRatio";
import { useTheme } from "../../../ThemeContext";
import { FONTS } from "../../Constants/Fonts";
import NavigationService from "../../Services/Navigation";


const BookingSummary = ({ setSummeryModal }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            {/* Booking Summary Title */}
            <View style={{...styles.summery_view,borderColor: colors.buttonColor}}>
                <Text style={styles.title}>Booking Summary</Text>
            </View>


            {/* Location Details */}
            <View style={styles.locationContainer}>
                <View>
                    <View style={styles.locationRow}>
                        <Image source={require('../../assets/images/location.png')} style={styles.pin_sty} />
                        <Text style={styles.drop_location}>PIck-UP</Text>
                    </View>
                    <Text style={styles.locationText}>
                        3036 Park Avenue, Kolkata-82, West Bengal
                    </Text>
                </View>
                <View>
                    <View style={styles.locationRow}>
                        <Image source={require('../../assets/images/lpin.png')} style={styles.pin_sty} />
                        <Text style={styles.drop_location}>PIck-UP</Text>
                    </View>
                    <Text style={styles.locationText}>
                        3036 Park Avenue, Kolkata-82, West Bengal
                    </Text>
                </View>


            </View>

            <View style={styles.carContainer}>
                <View>
                    <Image source={require('../../assets/images/Car.png')} style={styles.car_img} />
                    <Text style={styles.carName}>Toto</Text>
                </View>

                <View style={{ ...styles.fareDetails, borderColor: colors.buttonColor }}>
                    <Text style={styles.fareText}>Rate: Rs. 10/KM</Text>
                    <Text style={styles.fareText}>Distance Travelled: 5</Text>
                    <Text style={styles.fareText}>Total Price: Rs. 15</Text>
                    <Text style={styles.fareText}>Discount: Rs. 20</Text>
                </View>
            </View>

            <View style={{ ...styles.carContainer, borderTopWidth: 1, borderBottomWidth: 1 }}>
                <Text style={styles.paymentInstruction}>Rate: Rs. 50.00/KM</Text>

                <Text style={styles.paymentInstruction}>Distance Travelled:0.07 KM</Text>
            </View>

            <View style={{...styles.paid_view,backgroundColor:colors.buttonColor}}>
                
                    <View style={styles.fareContainer}>
                        <Text style={styles.fareTitle}>Total Trip Fare</Text>
                        <Text style={styles.totalFare}>₹ 200</Text>
                    </View>
             
            </View>

            <Text style={styles.paymentInstruction}>
                Please pay Rs.220.00 by Cash /Online to the Driver
                (Sergio Ramasis)

            </Text>

            <TouchableOpacity
                // onPress={() => { setSummeryModal(false), NavigationService.navigate('Home') }}
                style={styles.confirmationButton}>
                <Icon name={'check'} type={'MaterialIcons'} size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: moderateScale(10)
    },
    summery_view: {
        padding: moderateScale(7),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginTop: moderateScale(30),
        // paddingBottom: moderateScale(15),
        borderRadius:moderateScale(7)
    },
    title: {
        fontSize: moderateScale(16),
        fontFamily: FONTS.Poppins.semibold,
        textAlign: 'center',
        color: '#000',
   
    },
    locationContainer: {
        marginBottom: moderateScale(10),
        marginTop:moderateScale(10)
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: moderateScale(3),
    },
    drop_location: {
        marginLeft: moderateScale(7),
        color: "#000",
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(13),
    },
    locationText: {
        marginLeft: moderateScale(5),
        color: "#666",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(7)
    },
    pin_sty: {
        height: moderateScale(30),
        width: moderateScale(30),
        resizeMode: 'contain'
    },
    carContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: moderateScale(10),
    },
    car_img: {
        height: moderateScale(40),
        width: moderateScale(40),
        resizeMode: 'contain',
    },
    carName: {
        color: "#666",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
    },
    fareDetails: {
        padding: moderateScale(8),
        borderRadius: moderateScale(6),
        borderWidth: 1
    },
    fareText: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(11),
        color: "#000",
        marginTop: moderateScale(5)
    },
    fareContainer: {
        alignItems: "center",
        marginTop: moderateScale(7)
    },
    paid_view:{
        padding:moderateScale(15),
        borderRadius:moderateScale(10)
    },
    fareTitle: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14),
        color: "#fff",
    },
    totalFare: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(20),
        color: "#fff",
    },
    paymentInstruction: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(11),
        color: "#333",
        textAlign: "center",
        marginVertical: moderateScale(10),
    },
    confirmationButton: {
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: "#1C74EE",
        borderRadius: moderateScale(25),
        alignItems: "center",
        justifyContent: "center",
        marginTop: moderateScale(10),
        alignSelf: 'center'
    },
});

export default BookingSummary;
