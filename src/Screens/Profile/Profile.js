//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView, PermissionsAndroid, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import Header from '../../Components/Header/Header';
import Icon from '../../Ui/Icon';
import HomeService from '../../Services/HomeServises';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import NavigationService from '../../Services/Navigation';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// create a component
const { height, width } = Dimensions.get('screen')
const Profile = () => {
    const { colors } = useTheme();
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [MyProfile, setMyProfile] = useState([])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [isModalimg, setModalImg] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);

    const [selectedDate, setSelectedDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const DatehandleConfirm = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD'); 
        console.log('Selected Date:', formattedDate);
        setDob(formattedDate); 
        hideDatePicker();
    };



    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            // setButtonLoader(true);
            const res = await HomeService.setUserProfile()
            console.log('ressssssssssssssssssssssssssuser======================', res);

            if (res?.status === true) {
                setMyProfile(res?.data)
                setName(res?.data?.name)
                setEmail(res?.data?.email)
                setPhone(res?.data?.phone)
                setSelectedDocuments(res?.data?.image_path)
                setGender(res?.data?.gender)
                setDob(res?.data?.dob)

            } else {
                // Toast.show(res?.message || 'Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        } finally {
            setButtonLoader(false);
        }
    };


    const openCamera = async (type, options) => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "App Camera Permission",
                        message: "App needs access to your camera",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission denied");
                    return;
                }
            }
            onButtonPress(type, options);
        } catch (err) {
            console.warn(err);
        }
    };

    const onButtonPress = async (type, options) => {
        try {
            let result;
            if (type === 'capture') {
                result = await launchCamera(options);
            } else {
                result = await launchImageLibrary({ ...options, selectionLimit: 1 });
            }

            if (result.didCancel) {
                console.log('User cancelled image selection');
                return;
            } else if (result.errorCode) {
                console.error('Error in image selection:', result.errorMessage);
                return;
            } else if (result.assets && result.assets.length > 0) {
                const selectedAsset = result.assets[0];
                // console.log('Selectedassetyyyy:', selectedAsset);

                setSelectedDocuments([selectedAsset]);
                setModalImg(false)
            } else {
                console.log('No assets found in result:', result);
            }
        } catch (error) {
            console.error('Error in onButtonPress:', error);
        }
    };

    const getUserReg = async () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('phone', phone)
        formData.append('gender', gender)
        formData.append('dob', dob)
        selectedDocuments.forEach((image, index) => {
            formData.append('image', {
                uri: image.uri,
                name: image.fileName || `photo_${index}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });

        console.log('FormDatatosend:=======================00000000000=====>>>>>>>>>>>>', JSON.stringify(formData));

        try {
            setButtonLoader(true);
            const res = await HomeService.setUpdateProfile(formData)
            console.log('Registrationres========================', res)
            if (res?.status === true) {
                // setModalVisible(true)
                NavigationService.navigate('Home')
            } else {
                console.error('Registration failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error in getUserReg:', error);
        } finally {
            setButtonLoader(false)
        }
    };



    return (
        <View style={styles.container}>
            <Header title='Profile' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable onPress={() => setModalImg(true)} style={{ alignItems: 'center' }}>
                    <View style={{ ...styles.user_img_view, backgroundColor: colors.secondaryFontColor }}>
                        <Image
                            source={
                                selectedDocuments?.length > 0
                                    ? { uri: selectedDocuments[0].uri }

                                    : require('../../assets/images/noLogo.png')
                            }
                            style={{ ...styles.user_img }}
                        />

                    </View>
                    <Pressable onPress={() => setModalImg(true)} style={{ ...styles.camera_circle, backgroundColor: colors.primaryThemeColor }}>
                        <Image
                            source={require('../../assets/images/camera.png')}
                            style={styles.camera_img}
                        />
                    </Pressable>

                </Pressable>
                <Text style={{ ...styles.upload_txt, color: colors.secondaryFontColor }}>Upload your profile picture</Text>
                <Text style={{ ...styles.username_txt, color: colors.tintText }}>{MyProfile?.name}</Text>
                <View style={styles.ratingview}>
                    <Icon name={'star'} type={'Entypo'} color={'#EDAE10'} size={17} />
                    <Text style={{ ...styles.rating_txt, color: colors.primaryFontColor }}>5.00(10 Trips)</Text>
                </View>

                <TextInput
                    placeholder='Full Name'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        marginTop: moderateScale(30),
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    value={name}
                    keyboardType='numbers-and-punctuation'
                    onChangeText={(val) => setName(val)}

                />

                <TextInput
                    placeholder='Mobile Number'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='number-pad'
                    value={phone}
                    onChangeText={(val) => setPhone(val)}
                    maxLength={10}
                />

                <TextInput
                    placeholder='Email'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                    value={email}
                    onChangeText={(val) => setEmail(val)}
                />

                <TextInput
                    placeholder='Gender'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                    value={gender}
                    onChangeText={(val) => setGender(val)}
                />

                <View style={{
                    ...styles.input_sty,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>

                    <Text style={{ ...styles.time_to_txt, color: colors.secondaryText }}>{!dob == '' ? moment(dob).format('L') : 'DOB'}</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={DatehandleConfirm}
                        maximumDate={new Date()}
                        onCancel={hideDatePicker}
                    />
                </View>






                {/* <View style={{
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
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Icon
                            name={showPassword ? 'eye' : 'eye-off'}
                            type="Feather"
                            color={colors.secondaryFontColor}
                            size={20}
                        />
                    </TouchableOpacity>
                </View> */}

                {/* <View style={styles.button_view}>
                    <TouchableOpacity
                        style={{
                            ...styles.button_sty,
                            borderWidth: 1,
                            borderColor: colors.buttonColor,
                            backgroundColor: colors.inputBox
                        }}>
                        <Text style={{ ...styles.signin_txt, color: colors.tintText }}>Cancle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>getUserReg()}
                        style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                        <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Save</Text>
                    </TouchableOpacity>
                </View> */}

                <TouchableOpacity
                    onPress={() => getUserReg()}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Save</Text>
                </TouchableOpacity>

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

                </View>
            </Modal>


            <Modal isVisible={isModalimg}
                onBackButtonPress={() => setModalImg(false)}
                onBackdropPress={() => setModalImg(false)}
                transparent={true}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Upload Photo!</Text>

                    <TouchableOpacity
                        style={styles.modalbutton}
                        onPress={() => openCamera('capture', {
                            saveToPhotos: true,
                            mediaType: 'photo',
                            includeBase64: false,
                            maxWidth: 500,
                            maxHeight: 500,
                            quality: 0.5
                        })}
                    >
                        <Text style={{ ...styles.modalbuttonText, color: colors.buttonColor }}>
                            <Icon name="camera" size={18} type='Entypo' color={colors.buttonColor} />
                            {" "}Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalbutton}
                        onPress={() => openCamera('library', {
                            selectionLimit: 1,
                            mediaType: 'photo',
                            includeBase64: false,
                            maxWidth: 500,
                            maxHeight: 500,
                            quality: 0.5
                        })}
                    >
                        <Text style={{ ...styles.modalbuttonText, color: colors.buttonColor }}>
                            <Icon name="image" size={18} type='Entypo' color={colors.buttonColor} />
                            {" "}Library
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.modalCancel}
                        onPress={() => setModalImg(false)}>
                        <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>
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
    user_img: {
        alignSelf: 'center',
        height: moderateScale(100),
        width: moderateScale(100),
        borderRadius: moderateScale(50)
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
    time_to_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    button_sty: {
        width: moderateScale(150),
        height: moderateScale(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(7),
        marginTop: moderateScale(150)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
    user_img_view: {
        height: moderateScale(90),
        width: moderateScale(90),
        borderRadius: moderateScale(60),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(10)
    },
    camera_circle: {
        height: moderateScale(24),
        width: moderateScale(24),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: moderateScale(5),
        right: moderateScale(125)
    },
    camera_img: {
        height: moderateScale(13),
        width: moderateScale(17)
    },
    upload_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(15),
        textAlign: "center",
        marginTop: moderateScale(15)
    },
    modalView: {
        height: '80%',
        width: '50%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_view: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(15),
        justifyContent: 'space-between',
        paddingBottom: moderateScale(20)
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
    modalContainer: {
        backgroundColor: '#fff',
        padding: moderateScale(20),
        margin: moderateScale(20),
        borderRadius: moderateScale(10),
        alignItems: 'center',
    },
    modalTitle: {
        padding: moderateScale(10),
        borderBottomWidth: 1,
        marginBottom: moderateScale(15),
        fontSize: moderateScale(18),
        fontFamily: FONTS.Poppins.semibold,
    },
    modalbuttonText: {
        fontSize: moderateScale(18),
        padding: moderateScale(10),
        fontFamily: FONTS.Poppins.medium,
    },
    modalCancelText: {
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.regular,
        color: '#000'
    },
    rating_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginLeft: moderateScale(5)
    },
    ratingview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    username_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13),
        textAlign: 'center',
        marginTop: moderateScale(5)
    },
    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(7),
        marginTop: moderateScale(90),
        alignSelf: 'center',
        marginBottom: moderateScale(20)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
});

//make this component available to the app
export default Profile;
