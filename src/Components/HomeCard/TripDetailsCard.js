import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { useTheme } from '../../../ThemeContext';
import GetLocation from 'react-native-get-location'
import haversine from 'haversine';
// import Geocoder from 'react-native-geocoding';

const TripDetailsCard = ({ getDropOff, bookData,setsummeryLoader,summeryLoader }) => {
    const { colors } = useTheme();
  

    // console.log('------------------------------------nnnnnnnnnnnnnnnnnnnnnnnnnnn-------NNNNNNNNNN---', bookData);

    const [isNearDropOff, setIsNearDropOff] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    // const [currentPlace, setCurrentPlace] = useState('');

    const startLatitude = Number(bookData?.data?.pickup_latitude);
    const startLongitude = Number(bookData?.data?.pickup_longitude);
    const destinationLatitude = Number(bookData?.data?.drop_latitude);
    const destinationLongitude = Number(bookData?.data?.drop_longitude);

    useEffect(() => {
        const locationInterval = setInterval(getCurrentLocation, 5000);
        return () => clearInterval(locationInterval);
    }, []);

    const getCurrentLocation = async () => {
        try {
            const location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 5000,
            });

            const { latitude, longitude } = location;
            setUserLocation({ latitude, longitude });

            // Reverse geocode to get the place name
            // Geocoder.from(latitude, longitude)
            //     .then(response => {
            //         const place = response.results[0].formatted_address;
            //         setCurrentPlace(place);
            //     })
            //     .catch(error => console.warn('Geocoding error:', error));

            // Check if user is within 50 meters of drop-off
            const distance = haversine(
                { latitude, longitude },
                { latitude: destinationLatitude, longitude: destinationLongitude },
                { unit: 'meter' }
            );

            setIsNearDropOff(distance <= 50);
        } catch (error) {
            console.warn('Error fetching location:', error);
        }
    };



    const handleSubmit = () => {
        console.log("Submitting Drop Off with Data:");
        console.log("Booking ID:", bookData?.data?.id);
        console.log("User Latitude:", userLocation?.latitude);
        console.log("User Longitude:", userLocation?.longitude);
        console.log("Distance (meters):", Number(distanceMeters.toFixed(2)));
        console.log("Distance (km):", Number((distanceMeters / 1000).toFixed(2)));
        setsummeryLoader(true)
        getDropOff(
            bookData?.data?.id,
            userLocation?.latitude,
            userLocation?.longitude,
            distanceMeters
        );
    };


    const [distanceMeters, setDistanceMeters] = useState(null);
    const [distanceKm, setDistanceKm] = useState(null);
    useEffect(() => {
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371000;
            const toRadians = (degree) => (degree * Math.PI) / 180;
            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        if (userLocation && bookData?.data?.drop_latitude && bookData?.data?.drop_longitude) {
            const userLat = userLocation.latitude;
            const userLon = userLocation.longitude;
            const dropLat = Number(bookData.data.drop_latitude);
            const dropLon = Number(bookData.data.drop_longitude);

            const calculatedDistance = calculateDistance(userLat, userLon, dropLat, dropLon);

            setDistanceMeters(calculatedDistance);
            setDistanceKm((calculatedDistance / 1000).toFixed(2)); // Convert to km

            console.log("User Location:", userLat, userLon);
            console.log("Drop-off Location:", dropLat, dropLon);
            console.log("Calculated Distance (meters):", calculatedDistance);
            console.log("Calculated Distance (km):", (calculatedDistance / 1000).toFixed(2));
        }
    }, [userLocation, bookData]);




    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving`;
        Linking.openURL(url).catch(err => console.log('An error occurred', err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.top_view}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../assets/images/uuuu.png')} style={styles.user_img} />
                    <Text style={{ ...styles.user_name, color: colors.primaryFontColor }}>{bookData?.data?.customer_name}</Text>
                </View>
                <Image source={{ uri: bookData?.data?.image_path }} style={styles.car_img} />
            </View>

            <View style={styles.locationContainer}>
                <Image source={require('../../assets/images/lpin.png')} style={styles.pin_sty} />
                <Text style={styles.address}>{bookData?.data?.drop_location}</Text>
            </View>

            <View style={styles.infoContainer}>

                <Text style={styles.infoText}>Estimated: <Text style={styles.boldText}>₹ {bookData?.data?.total_amount}</Text></Text>


                <View style={styles.infoRow}>
                    <Image source={require('../../assets/images/distance-icon.png')} style={styles.pin_sty} />
                    <Text style={styles.infoText}>Distance: {bookData?.data?.total_distance} KM</Text>
                </View>

                <View style={styles.infoRow}>
                    <Image source={require('../../assets/images/duration-icon.png')} style={styles.pin_sty} />
                    <Text style={styles.infoText}>Duration: {bookData?.data?.trip_time} min</Text>
                </View>

                <View style={{ ...styles.infoRow, borderBottomWidth: 0 }}>
                    <Image source={require('../../assets/images/location.png')} style={styles.pin_sty} />
                    <Text style={styles.infoText}>
                        Pick Up: <Text style={styles.boldText}>{bookData?.data?.pick_time}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                        ...styles.button_sty,
                        marginLeft: 15,
                        backgroundColor: summeryLoader ? 'gray' : colors.buttonColor, // Disable button when loading
                        opacity: summeryLoader ? 0.5 : 1,
                    }}
                    disabled={summeryLoader} // Disable button while loading
                >
                    {summeryLoader ? (
                        <ActivityIndicator color={colors.secondaryThemeColor} />
                    ) : (
                        <Text style={{ ...styles.button_txt, color: colors.secondaryThemeColor }}>Drop Off</Text>
                    )}
                </TouchableOpacity>
                {/* picupData */}
                <TouchableOpacity
                    onPress={() => openGoogleMaps()}
                    // onPress={handleSubmit}
                    style={{ ...styles.button_sty, marginLeft: 15, backgroundColor: '#1C74EE' }}>
                    <Text style={{ ...styles.button_txt, color: colors.secondaryThemeColor }}>Start Navigation</Text>
                </TouchableOpacity>
            </View>



        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: moderateScale(10),
    },
    top_view: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        borderTopColor: "#ddd",
        padding: moderateScale(7)
    },
    user_img: {
        height: moderateScale(50),
        width: moderateScale(50),
        resizeMode: 'contain',
    },
    user_name: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13),
        marginLeft: moderateScale(10)
    },
    car_img: {
        height: moderateScale(40),
        width: moderateScale(40),
        resizeMode: 'contain',
    },
    pin_sty: {
        height: moderateScale(20),
        width: moderateScale(20),
        resizeMode: 'contain'
    },
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: moderateScale(10),
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: moderateScale(6),
        marginHorizontal: moderateScale(13)
    },
    address: {
        marginLeft: moderateScale(5),
        color: "#666",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        maxWidth: '95%'
    },
    infoContainer: {
        marginVertical: moderateScale(6),
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: moderateScale(4),
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: moderateScale(6),
        marginHorizontal: moderateScale(13)
    },
    infoText: {
        marginLeft: moderateScale(5),
        color: "#666",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
    },
    boldText: {
        color: "#000",
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: moderateScale(15)
    },
    button_sty: {
        height: moderateScale(42),
        width: moderateScale(120),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(7)
    },
    button_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
    },
})

export default TripDetailsCard