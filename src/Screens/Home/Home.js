//import liraries
import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Dimensions, Modal, Image, Pressable, Linking, TouchableWithoutFeedback } from 'react-native';
import Icon from '../../Ui/Icon';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import DrawerCard from '../../Components/DrawerCard/DrawerCard';
import { FONTS } from '../../Constants/Fonts';
import CustomToggleSwitch from '../../Ui/CustomToggleSwitch';
import { apiKey } from '../../Utils/apiKey';
import GetLocation from 'react-native-get-location'
import { useSelector } from 'react-redux';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import HomeService from '../../Services/HomeServises';
import mapStyle from './mapStyle.json';
import OtpModalCard from '../../Components/HomeCard/OtpModalCard';
import TripDetailsCard from '../../Components/HomeCard/TripDetailsCard';
import BookingSummary from '../../Components/HomeCard/BookingSummary';
import CustomMarker from '../../Ui/CustomMarker';

const { height, width } = Dimensions.get('window');
// create a component
const Home = () => {
    const { colors } = useTheme();
    const mapRef = useRef(null);
    const { userData } = useSelector(state => state.User)
    const [picUpModal, setPicUpModal] = useState(false);
    const [StartpickUpModal, setStartpickUpModal] = useState(false);
    const [picupData, setPicupData] = useState([])

    const [BookingData, setBookingData] = useState([])
    const [NoDataModal, setNoDataModal] = useState(false);

    const [userLocation, setUserLocation] = useState(null);

    const [isOnline, setIsOnline] = useState(userData?.login_status === 1 ? 1 : 0);
    const handleToggleSwitch = (value) => {
        setIsOnline(value ? 1 : 0);
    };

    const [isModalDrawerVisible, setModalDrawerVisible] = useState(false);

    const HandleOpenDrawer = () => {
        setModalDrawerVisible(true)
    };

    const closeDrawer = () => {
        setModalDrawerVisible(false);
    };

    useEffect(() => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 5000,
        })
            .then(location => {
                setUserLocation({
                    latitude: location.latitude,
                    longitude: location.longitude,
                });
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    });
                }
            })
            .catch(error => console.log('Error fetching location:', error));
    }, []);

    useEffect(() => {
        if (
            userLocation?.latitude &&
            userLocation?.longitude &&
            isOnline === 1
        ) {
            getUserLocaton();
        }
    }, [userLocation, isOnline]);


    const getUserLocaton = async () => {
        const formData = new FormData()
        formData.append('latitude', userLocation?.latitude)
        formData.append('longitude', userLocation?.longitude)
        formData.append('status', isOnline)
        try {
            const res = await HomeService.setDriverLocation(formData)
            if (res?.status === true) {
                GetUserData()
            } else {
                console.log('failed:', res?.message || 'Unknown log');
            }
        } catch (error) {
            console.log('Error in Home:', error);
        }
    };

    const GetUserData = async () => {
        try {
            const res = await HomeService.setUserData();
            console.log('Fetched user List:-----------------------------------------------------------', res);
            if (res?.data === null) {
                console.log('No data received---------------------------');
                setNoDataModal(true);
            } else {
                setPicUpModal(true);
                setPicupData(res.data);
            }
        } catch (error) {
            console.log('Error fetching user list:', error);
        }
    };


    const GetAcceptBook = async (bookingid) => {
        let data = {
            "booking_id": bookingid
        }
        try {
            const res = await HomeService.setAcceptBooking(data);
            if (res?.status === true) {
                setPicUpModal(false)
                GetAcceptBookData()
            } else {
                console.log('Fetching------------------ failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.log('Error list:------------------------------', error);
        }
    };

    const origin = BookingData?.driver_location?.latitude && BookingData?.driver_location?.longitude
        ? {
            latitude: Number(BookingData.driver_location.latitude),
            longitude: Number(BookingData.driver_location.longitude),
        }
        : null;

    const destination = BookingData?.data?.pickup_latitude && BookingData?.data?.pickup_longitude
        ? {
            latitude: Number(BookingData.data.pickup_latitude),
            longitude: Number(BookingData.data.pickup_longitude),
        }
        : null;

    const GetAcceptBookData = async () => {
        setStartpickUpModal(true)
        try {
            const res = await HomeService.setAcceptBookingData();
            // console.log('-------------------------------->>>>>>>>>>>>>>>>>>>-------================---:', res);
            if (res?.status === true) {
                setBookingData(res)
            } else {
                console.log('-----------------failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error list:------------------------------', error);
        }
    };

    const startLatitude = Number(BookingData?.driver_location?.latitude);
    const startLongitude = Number(BookingData?.driver_location?.longitude);
    const destinationLatitude = Number(BookingData?.data?.pickup_latitude);
    const destinationLongitude = Number(BookingData?.data?.pickup_longitude);

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${startLatitude},${startLongitude}&destination=${destinationLatitude},${destinationLongitude}&travelmode=driving&mapstyle=night`;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    };

    const [OtpModal, setOtpModal] = useState(false);
    const [OtpLoader, setOtpLoader] = useState(false);

    const [totalTripData, setTotalTripData] = useState(false);


    const getOtpSubmit = async (rId, otp) => {
        const otpData = otp.join('')
        setOtpLoader(true)
        let data = {
            "booking_id": rId,
            "otp": otpData,
        }
        try {
            const res = await HomeService.setStartTrip(data);
            // console.log('totallllllllllllllllllllllllllllllll--------------->>>>>>>>--------------', JSON.stringify(res));
            if (res?.status === true) {
                setOtpLoader(false);
                GetafterTrip()
                setTotalTripData(res.data)
            }
        } catch (error) {
            // console.error('Error fetching car list:------------------------------', error);
        } finally {
            setOtpLoader(false);
        }
    };

    const [FullBookingData, setFullBookingData] = useState(false);

    const GetafterTrip = async () => {
        setTripUserModal(true)
        try {
            const res = await HomeService.setAfterTrip();
            if (res?.status === true) {
                setFullBookingData(res)
            } else {
                console.log('Fetching fu8888888888888888888 failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.log('Error list:------------------------------', error);
        }
    };


    const [TripUserModal, setTripUserModal] = useState(false);
    const [summeryModal, setSummeryModal] = useState(false);


    const [summeryLoader, setsummeryLoader] = useState(false);

    const getDropOff = async (bId, lat, long, dis) => {
        setsummeryLoader(true)
        let data = {
            "booking_id": bId,
            "distance": Number(dis.toFixed(2)),
            "drop_longitude": long,
            "drop_latitude": lat,
            "distance_in_text": `${Number(dis / 1000).toFixed(2)} km`,
        }
        try {
            const res = await HomeService.setEndTrip(data);
            // console.log('totallllllllllllllllllllllllllllllll--------------->>>>>>>>--------------', JSON.stringify(res));
            if (res?.status === true) {
                setSummeryModal(true);
                GetFullSummery(res?.data?.id)
            }
        } catch (error) {
            // console.error('Error fetching car list:------------------------------', error);
        } finally {
            setsummeryLoader(false);
        }
    };

    const [summeryData, setSummeryData] = useState([]);
    const GetFullSummery = async (bookingId) => {
        let data = {
            "booking_id": bookingId,
        }
        try {
            const res = await HomeService.setShowsummery(data);
            // console.log('----------showsssssssssssssssssssssssssss=====---:', res);
            if (res?.status === true) {
                setSummeryData(res)
            } else {
                console.log('Fetching summery8888888 failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.log('Error list:------------------------------', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                customMapStyle={mapStyle}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: userLocation?.latitude || 22.5726,
                    longitude: userLocation?.longitude || 88.3639,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {userLocation && <CustomMarker coordinate={userLocation} />}

                {/* Pick-up Marker */}
                {origin && (
                    <Marker coordinate={origin} title="Car Start">
                        <Image
                            source={require('../../assets/images/driverCar.png')}
                            style={styles.dcar_img}
                        />
                    </Marker>
                )}

                {/* Drop-off Marker */}
                {destination && (
                    <Marker coordinate={destination} title="Car End">
                        <Image
                            source={require('../../assets/images/userCar.png')}
                            style={[styles.dcar_img, { transform: [{ rotate: '180deg' }] }]}
                        />
                    </Marker>
                )}

                {origin && destination && origin.latitude !== destination.latitude && origin.longitude !== destination.longitude && (
                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={apiKey}
                        strokeWidth={6}
                        strokeColor="#FEC400"
                        optimizeWaypoints={true}
                        mode="DRIVING"
                        zIndex={2}
                    />
                )}

                {userLocation && origin && (
                    <Polyline
                        coordinates={[
                            userLocation,
                            origin,
                        ]}
                        strokeColor="rgba(255, 204, 0, 0.6)"
                        strokeWidth={4}
                        lineDashPattern={[5, 10]}
                    />
                )}

            </MapView>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <View style={{ ...styles.toggle_view, backgroundColor: colors.primaryThemeColor }}>
                    <TouchableOpacity onPress={() => HandleOpenDrawer()} style={styles.drawer_view}>
                        <Icon name={'bars'} type={'FontAwesome6'} size={24} color={'#000'} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.online_txt, color: colors.primaryFontColor }}>
                        {isOnline === 1 ? 'Online' : 'Offline'}
                    </Text>

                    <View style={{ marginRight: moderateScale(15) }}>
                        <CustomToggleSwitch
                            value={isOnline === 1}
                            onValueChange={handleToggleSwitch}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => GetUserData()}
                    style={styles.refress_view}>
                    <Image source={require('../../assets/images/refreshsmall.png')} style={styles.refress_img} />
                </TouchableOpacity>
            </View>

            <Modal
                transparent={true}
                visible={isModalDrawerVisible}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                onRequestClose={closeDrawer}
                backdropOpacity={0.7}
            >
                <TouchableOpacity style={styles.modalBackdrop} onPress={closeDrawer}>

                    <View style={styles.drawerContainer}>
                        <DrawerCard closeDrawer={closeDrawer} />
                    </View>

                </TouchableOpacity>
            </Modal>




            <Modal visible={picUpModal} animationType="slide" transparent={true} >
                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <View style={styles.half_modal}>
                        <Text style={{ ...styles.transport_txt, color: colors.primaryFontColor }}>Your new ride request details</Text>
                        <Image source={require('../../assets/images/uuuu.png')} style={styles.user_img} />
                        <Text style={{ ...styles.user_name, color: colors.primaryFontColor }}>{picupData?.customer_name}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center' }}>
                            <Image source={require('../../assets/images/location.png')} style={styles.location_pin_img} />
                            <Text style={{ ...styles.pic_up_txt, color: colors.primaryFontColor }}>Pick Up</Text>
                        </View>
                        <Text style={{ ...styles.location_txt, color: colors.tintText }}>{picupData?.pickup_location}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => setPicUpModal(false)}
                                style={{ ...styles.button_sty, borderWidth: 1, borderColor: colors.buttonColor }}>
                                <Text style={{ ...styles.button_txt, color: colors.buttonColor }}>Ignore</Text>
                            </TouchableOpacity>
                            {/* picupData */}
                            <TouchableOpacity
                                onPress={() => GetAcceptBook(picupData.id)}
                                style={{ ...styles.button_sty, marginLeft: 15, backgroundColor: colors.buttonColor }}>
                                <Text style={{ ...styles.button_txt, color: colors.secondaryThemeColor }}>Accept</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </Modal>

            <Modal visible={NoDataModal} animationType="slide" transparent={true}
                onRequestClose={() => setNoDataModal(false)}
            >
                <Pressable
                    style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', }}
                    onTouchEnd={() => setNoDataModal(false)}
                >
                    <View style={{ ...styles.nodata_view, backgroundColor: colors.buttonColor }}>
                        <Text style={{ ...styles.online_txt, color: colors.secondaryThemeColor }}>
                            Sorry, No records found
                        </Text>
                    </View>
                </Pressable>
            </Modal>


            {StartpickUpModal && (
                <View style={{ ...styles.start_trip_view, height: moderateScale(250) }}>
                    <Image source={require('../../assets/images/phone_call.png')} style={styles.call_img} />

                    <TouchableOpacity keyboardShouldPersistTaps="handled"
                        onPress={() => { setOtpModal(true), setStartpickUpModal(false) }}
                        style={{ ...styles.pickbutton_sty, backgroundColor: colors.buttonColor }}>
                        <Text style={{ ...styles.pickup_txt, color: colors.secondaryThemeColor }}>I ‘ve reached Pickup location</Text>

                    </TouchableOpacity>

                    <TouchableOpacity keyboardShouldPersistTaps="handled" onPress={openGoogleMaps}
                        style={{ ...styles.pickbutton_sty, backgroundColor: '#4B7EC5' }}>
                        <Text style={{ ...styles.pickup_txt, color: colors.secondaryThemeColor }}>Open Navigation</Text>

                    </TouchableOpacity>
                </View>
            )}

            {OtpModal && (
                <View style={{ ...styles.start_trip_view, height: moderateScale(325) }}>
                    <OtpModalCard bookData={BookingData} setOtpModal={setOtpModal} getOtpSubmit={getOtpSubmit} />
                </View>
            )}

            <Modal visible={OtpLoader} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', }}>
                    <View style={{ ...styles.nodata_view, width: '60%', backgroundColor: colors.secondaryThemeColor }}>
                        <Text style={{ ...styles.online_txt, color: colors.primaryFontColor }}>
                            Starting Trip
                        </Text>
                    </View>
                </View>

            </Modal>



            {TripUserModal && (
                <View style={{ ...styles.start_trip_view }}>
                    <TripDetailsCard
                        setsummeryLoader={setsummeryLoader}
                        summeryLoader={summeryLoader}
                        bookData={FullBookingData}
                        getDropOff={getDropOff} />
                </View>
            )}

            {summeryModal && (
                <View style={{ ...styles.start_trip_view, height: '100%' }}>
                    <BookingSummary setSummeryModal={setSummeryModal} summeryData={summeryData} />
                </View>
            )}



        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map_img: {
        height: '100%',
        width: '100%'
    },
    toggle_view: {
        marginTop: moderateScale(40),
        height: moderateScale(40),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(4)
    },
    drawer_view: {
        height: moderateScale(40),
        width: moderateScale(40),
        backgroundColor: '#FFF1B1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(4)
    },
    drawerContainer: {
        width: moderateScale(240),
        height: height,
        backgroundColor: '#fff',
        borderTopRightRadius: moderateScale(30),
        borderBottomEndRadius: moderateScale(30),
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-start',
    },
    online_txt: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(15)
    },
    refress_view: {
        height: moderateScale(34),
        width: moderateScale(34),
        borderRadius: moderateScale(17),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF3636',
        marginTop: moderateScale(7),
        marginHorizontal: moderateScale(15),
        alignSelf: 'flex-end'
    },
    refress_img: {
        height: moderateScale(25),
        width: moderateScale(25)
    },
    dcar_img: {
        width: moderateScale(35),
        height: moderateScale(35),
        resizeMode: 'contain'
    },
    half_modal: {
        height: moderateScale(400),
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        padding: moderateScale(10),
        alignItems: 'center'
    },
    halfotp_modal: {
        height: moderateScale(350),
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        padding: moderateScale(15),
    },
    transport_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(14),
        marginTop: moderateScale(15)
    },
    user_img: {
        height: moderateScale(60),
        width: moderateScale(60),
        resizeMode: 'contain',
        marginTop: moderateScale(15)
    },
    user_name: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(15)
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
        marginTop: moderateScale(15)
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
    nodata_view: {
        height: moderateScale(50),
        width: '80%',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(10),
    },
    call_img: {
        height: moderateScale(40),
        width: moderateScale(40),
        tintColor: '#FEC400',
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: moderateScale(30)
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

    start_trip_view: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        height: moderateScale(315),
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        padding: moderateScale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    }
});

//make this component available to the app
export default Home;
