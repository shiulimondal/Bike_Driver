import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';

const NavigatinScreen = () => {
    const startLatitude = 28.7041; // Example start location (Delhi)
    const startLongitude = 77.1025;
    const destinationLatitude = 19.0760; // Example destination (Mumbai)
    const destinationLongitude = 72.8777;

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttn_sty} onPress={openGoogleMaps}>
                <Text style={styles.button_txt}>Open Navigation</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttn_sty: {
        height: 45,
        width: 330,
        backgroundColor: '#000',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14),
        color: '#fff'
    }
});

export default NavigatinScreen;
