import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import Icon from "../../Ui/Icon";
import { moderateScale } from "../../Constants/PixelRatio";
import { useTheme } from "../../../ThemeContext";
import { FONTS } from "../../Constants/Fonts";
import NavigationService from "../../Services/Navigation";


const BookingSummary = ({summeryData,setSummeryModal}) => {
    const { colors } = useTheme();
    console.log('summeryData-----------------------------------------',summeryData);
    const Bdata = summeryData.data;
    
    return (
        <View style={styles.container}>
            {/* Booking Summary Title */}
            <Text style={styles.title}>Booking Summary</Text>

            {/* Location Details */}
            <View style={styles.locationContainer}>
                <View style={styles.locationRow}>
                    <Image source={require('../../assets/images/location.png')} style={styles.pin_sty} />
                    <Text style={styles.locationText}>
                       {Bdata?.pickup_location}
                    </Text>
                </View>
                <View style={styles.locationRow}>
                    <Image source={require('../../assets/images/lpin.png')} style={styles.pin_sty} />
                    <Text style={styles.locationText}>
                        {Bdata?.drop_location}
                    </Text>
                </View>
            </View>

            <View style={styles.carContainer}>
                <View>
                    <Image source={{uri:Bdata?.image_path}} style={styles.car_img} />
                    <Text style={styles.carName}>{Bdata?.car_model}</Text>
                </View>

                <View style={{ ...styles.fareDetails, borderColor: colors.buttonColor }}>
                    <Text style={styles.fareText}>Rate: Rs. {Bdata?.rate_per_km}/KM</Text>
                    <Text style={styles.fareText}>Distance Travelled: {Bdata?.total_distance}</Text>
                    <Text style={styles.fareText}>Total Price: Rs. {Bdata?.total_amount}</Text>
                    <Text style={styles.fareText}>Discount: Rs. {Bdata?.discount_amount}</Text>
                </View>
            </View>

            <View>
                <ImageBackground source={require('../../assets/images/paid.png')}
                    resizeMode="contain"
                    style={{
                        height: moderateScale(80),
                        width: moderateScale(180),
                        alignSelf:'center',
                        marginTop:moderateScale(35)
                    }}
                >
                    <View style={styles.fareContainer}>
                        <Text style={styles.fareTitle}>Total Trip Fare</Text>
                        <Text style={styles.totalFare}>₹ {Bdata?.total_amount}</Text>
                    </View>
                </ImageBackground>
            </View>

            <Text style={styles.paymentInstruction}>
                Please collect Rs.{Bdata?.total_amount} by Cash/ Online from Nate
            </Text>

            <TouchableOpacity 
            onPress={()=> {setSummeryModal(false),NavigationService.navigate('Home')}}
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
    title: {
        fontSize: moderateScale(16),
        fontFamily: FONTS.Poppins.semibold,
        marginTop: moderateScale(30),
        textAlign: 'center',
        color: '#000',
        paddingBottom: moderateScale(10)
    },
    locationContainer: {
        marginBottom: moderateScale(10),
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: moderateScale(3),
    },
    locationText: {
        marginLeft: moderateScale(5),
        color: "#666",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
    },
    pin_sty: {
        height: moderateScale(22),
        width: moderateScale(22),
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
        marginTop:moderateScale(7)
    },
    fareTitle: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14),
        color: "#000",
    },
    totalFare: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(20),
        color: "#000",
    },
    paymentInstruction: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(11),
        color: "#333",
        textAlign: "center",
        marginVertical:moderateScale(10),
    },
    confirmationButton: {
        width: moderateScale(50),
        height: moderateScale(50),
        backgroundColor: "#1C74EE",
        borderRadius: moderateScale(25),
        alignItems: "center",
        justifyContent: "center",
        marginTop: moderateScale(10),
        alignSelf:'center'
    },
});

export default BookingSummary;
