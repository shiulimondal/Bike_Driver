//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, PermissionsAndroid, TextInput, Pressable } from 'react-native';
import Header from '../../Components/Header/Header';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import Modal from 'react-native-modal';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from '../../Ui/Icon';
import HomeService from '../../Services/HomeServises';
import CustomPicker from '../../Ui/CustomPicker';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import NavigationService from '../../Services/Navigation';

const { height, width } = Dimensions.get('screen')
// create a component
const CarManagment = () => {
    const { colors } = useTheme();
    const [allCarDetials, setAllCarDetials] = useState([]);
    const [frontImg, setfrontImg] = useState([]);
    const [isModalFrontimg, setModalFrontImg] = useState(false);
    const [backImg, setBackImg] = useState([]);
    const [isModalBackimg, setModalBackImg] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);

    const [DateData, setDateData] = useState('');
    const [Date, setDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [DateDataa, setDateDataa] = useState('');
    const [Datee, setDatee] = useState('');
    const [isDatePickerVisiblee, setDatePickerVisibilityy] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const DatehandleConfirm = (date) => {
        console.log('dateeeeeeee', moment(date).format('YYYY-MM-DD'));
        setDate(moment(date).format('YYYY-MM-DD'));
        hideDatePicker();
    };


    const showDatePickerr = () => {
        setDatePickerVisibilityy(true);
    };

    const hideDatePickerr = () => {
        setDatePickerVisibilityy(false);
    };

    const DatehandleConfirmm = (date) => {
        console.log('dateeeeeeee', moment(date).format('YYYY-MM-DD'));
        setDatee(moment(date).format('YYYY-MM-DD'));
        hideDatePickerr();
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
            onButtonFrontPress(type, options);
        } catch (err) {
            console.warn(err);
        }
    };

    const onButtonFrontPress = async (type, options) => {
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

                setfrontImg([selectedAsset]);
                setModalFrontImg(false)
            } else {
                console.log('No assets found in result:', result);
            }
        } catch (error) {
            console.error('Error in onButtonPress:', error);
        }
    };

    const openCameraBack = async (type, options) => {
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
            onButtonBackPress(type, options);
        } catch (err) {
            console.warn(err);
        }
    };

    const onButtonBackPress = async (type, options) => {
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

                setBackImg([selectedAsset]);
                setModalBackImg(false)
            } else {
                console.log('No assets found in result:', result);
            }
        } catch (error) {
            console.error('Error in onButtonPress:', error);
        }
    };

    const [carList, setCarList] = useState([]);
    const [SelectcarList, setSelectcarList] = useState('');

    const [carTypeList, setCarYtpeList] = useState([]);
    const [SelectcarType, setSelectcarType] = useState('');

    const [carColorList, setCarColorList] = useState([]);
    const [SelectcarColor, setSelectcarColor] = useState('');
    const [regNumber, setRegNumber] = useState('');
    const [CertificateFont, setCertificateFont] = useState([])
    const [CertificateBack, setCertificateBack] = useState([])

    const [fualType, setFualType] = useState([
        { "id": 1, "name": "Petrol" },
        { "id": 2, "name": "Diesel" },
        { "id": 3, "name": "EV" },
    ]);
    const [SelectFualType, setSelectFualType] = useState('');

    useEffect(() => {
        getCarlist(),
            getCarColor()
    }, [])

    useEffect(() => {
        getShowCarDetails()
    }, [])

    const getCarlist = async () => {
        try {
            const res = await HomeService.setcarlist()
            // console.log('ressssssssssssssssssssssssssuser====carrrrr==================', res);
            if (res?.status === true) {
                setCarList(res.data)
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    };

    const getCarmodellist = async (carid) => {
        const data = {
            "car_category_id": carid,
        };
        try {
            const res = await HomeService.setcarmedellist(data)
            // console.log('ressssssssssssssssssssssssssuser====carrrrr====typeeeeeeeeeeeeeeeeeee==============', res);
            if (res?.status === true) {
                setCarYtpeList(res.data)
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    };

    const getCarColor = async () => {
        try {
            const res = await HomeService.setcarColorlist()
            console.log('ressssssssssssssssssssssssssuser====carrrrr========colorrrrr==========', res);
            if (res?.status === true) {
                setCarColorList(res.data)
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    };

    const getShowCarDetails = async () => {
        try {
            const res = await HomeService.setcarDetails()
            // console.log('resssssssssssssssssssss>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>======', res);
            if (res?.status === true) {
                setAllCarDetials(res.data)
                setSelectcarList(res?.data?.car_category_id) 
                getCarmodellist(res?.data?.car_category_id)
                setCarYtpeList(res?.data?.car_model_id)
                setSelectcarColor(res?.data?.color_id)
                setRegNumber(res?.data?.registration_no)
                setSelectFualType(res?.data?.fuel_type)
                setDateData(res?.data?.manufacturing_date)
                setDateDataa(res?.data?.registration_date)
                setCertificateFont(res?.data)
                setCertificateBack(res?.data)
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    };

    const getCarDetails = async () => {
        const formData = new FormData()
        formData.append('car_category_id', SelectcarList);
        formData.append('car_model_id', SelectcarType);
        formData.append('color_id', SelectcarColor);
        formData.append('registration_no', regNumber);
        formData.append('registration_date', Datee);
        formData.append('manufacturing_date', Date);
        formData.append('fuel_type', SelectFualType);

        frontImg.forEach((image, index) => {
            formData.append('certificate_front_image', {
                uri: image.uri,
                name: image.fileName || `photo_${index}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });
        backImg.forEach((image, index) => {
            formData.append('certificate_back_image', {
                uri: image.uri,
                name: image.fileName || `photo_${index}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });

        console.log('FormDatatosend:=======================00000000000==licenceeeeeeeeeeee===', JSON.stringify(formData));
        try {
            setButtonLoader(true);
            const res = await HomeService.setAddCarData(formData)
            // console.log('Registrationres========================', res)
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
            <Header title='Car Management' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomPicker
                        labelKey="name"
                        valueKey="id"
                        placeholder="Transport Type"
                        options={carList}
                        selectedValue={SelectcarList}
                        onValueChange={(val) => { setSelectcarList(val), getCarmodellist(val) }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomPicker
                        labelKey="name"
                        valueKey="id"
                        placeholder="Transport Model"
                        options={carTypeList}
                        selectedValue={SelectcarType}
                        onValueChange={(val) => { setSelectcarType(val) }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />

                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomPicker
                        labelKey="name"
                        valueKey="id"
                        placeholder="Transport Color"
                        options={carColorList}
                        selectedValue={SelectcarColor}
                        onValueChange={(val) => { setSelectcarColor(val) }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />

                </View>

                <TextInput
                    placeholder='Car Registration Number'
                    // placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                    value={regNumber}
                    onChangeText={(val) => setRegNumber(val)}
                />

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <CustomPicker
                        labelKey="name"
                        valueKey="id"
                        placeholder="Fuel Type"
                        options={fualType}
                        selectedValue={SelectFualType}
                        onValueChange={(val) => { setSelectFualType(val) }}
                        textStyle={{
                            fontSize: 15,
                        }}
                    />
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        onPress={showDatePicker}
                        style={{
                            ...styles.time_input_sty,
                            borderColor: colors.borderColor,
                            color: colors.primaryFontColor,
                            backgroundColor: colors.secondaryThemeColor
                        }}>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={val => {
                                DatehandleConfirm(val);
                                setDateData(val);
                            }}
                            onCancel={hideDatePicker}
                        />
                        <Text
                            style={{
                                color: colors.primaryFontColor,
                                fontFamily: FONTS.Poppins.medium,
                                fontSize: moderateScale(13)
                            }}>
                            {!DateData == '' ? moment(DateData).format('L') : 'Manufacturing Date'}
                        </Text>
                        <Image source={require('../../assets/images/calendar.png')}
                            style={{ height: moderateScale(25), width: moderateScale(25), tintColor: '#999' }}
                        />
                    </Pressable>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Pressable
                        onPress={showDatePickerr}
                        style={{
                            ...styles.time_input_sty,
                            borderColor: colors.borderColor,
                            color: colors.primaryFontColor,
                            backgroundColor: colors.secondaryThemeColor
                        }}>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisiblee}
                            mode="date"
                            onConfirm={val => {
                                DatehandleConfirmm(val);
                                setDateDataa(val);
                            }}
                            onCancel={hideDatePickerr}
                        />
                        <Text
                            style={{
                                color: colors.primaryFontColor,
                                fontFamily: FONTS.Poppins.medium,
                                fontSize: moderateScale(13)
                            }}>
                            {!DateDataa == '' ? moment(DateDataa).format('L') : 'Registration Date'}
                        </Text>
                        <Image source={require('../../assets/images/calendar.png')}
                            style={{ height: moderateScale(25), width: moderateScale(25), tintColor: '#999' }}
                        />
                    </Pressable>
                </View>


                <Text style={{ ...styles.doc_title_txt, color: colors.primaryFontColor }}>Please upload your Car Registration Certificates below </Text>

                <TouchableOpacity
                    onPress={() => setModalFrontImg(true)}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Certificate Front</Text>
                </TouchableOpacity>


                <View style={{ ...styles.img_view }}>
                    <Image
                        source={
                            frontImg?.length > 0
                                ? { uri: frontImg[0].uri }
                                : CertificateFont?.certificate_front_image_path
                                    ? { uri: CertificateFont?.certificate_front_image_path }
                                    : require('../../assets/images/blankimg.png')
                        }
                        style={styles.blank_img}
                    />

                </View>

                <TouchableOpacity
                    onPress={() => setModalBackImg(true)}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Certificate Back</Text>
                </TouchableOpacity>

                <View style={{ ...styles.img_view }}>
                    <Image
                        source={
                            backImg?.length > 0
                                ? { uri: backImg[0].uri }
                                : CertificateBack?.certificate_back_image_path
                                    ? { uri: CertificateBack?.certificate_back_image_path }
                                    : require('../../assets/images/blankimg.png')
                        }
                        style={styles.blank_img}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => getCarDetails()}
                    style={{ ...styles.button_sty, marginTop: moderateScale(30), backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>


            <Modal isVisible={isModalFrontimg}
                onBackButtonPress={() => setModalFrontImg(false)}
                onBackdropPress={() => setModalFrontImg(false)}
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
                        onPress={() => setModalFrontImg(false)}>
                        <Text style={styles.modalCancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal isVisible={isModalBackimg}
                onBackButtonPress={() => setModalBackImg(false)}
                onBackdropPress={() => setModalBackImg(false)}
                transparent={true}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Upload Photo!</Text>

                    <TouchableOpacity
                        style={styles.modalbutton}
                        onPress={() => openCameraBack('capture', {
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
                        onPress={() => openCameraBack('library', {
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
                        onPress={() => setModalBackImg(false)}>
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
    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(7),
        marginTop: moderateScale(20),
        alignSelf: 'center',
        marginBottom: moderateScale(20)
    },
    input_sty: {
        borderWidth: 1,
        marginHorizontal: moderateScale(15),
        height: moderateScale(48),
        borderRadius: moderateScale(5),
        paddingHorizontal: moderateScale(10),
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13),
        marginTop: moderateScale(10)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
    blank_img: {
        height: moderateScale(100),
        width: moderateScale(100)
    },
    img_view: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        width: moderateScale(200),
        alignSelf: 'center',
        height: moderateScale(150)
    },
    doc_title_txt: {
        textAlign: 'center',
        fontSize: moderateScale(11),
        fontFamily: FONTS.Poppins.semibold,
        marginTop: moderateScale(10)
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
    time_input_sty: {
        borderWidth: 1,
        borderRadius: moderateScale(5),
        paddingHorizontal: moderateScale(10),
        height: moderateScale(48),
        width: width - moderateScale(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: moderateScale(10)
    },
});

//make this component available to the app
export default CarManagment;
