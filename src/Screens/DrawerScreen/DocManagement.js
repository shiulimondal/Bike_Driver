//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TextInput, TouchableOpacity, ScrollView, PermissionsAndroid } from 'react-native';
import Header from '../../Components/Header/Header';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from '../../Ui/Icon';
import Modal from 'react-native-modal';
import HomeService from '../../Services/HomeServises';
import NavigationService from '../../Services/Navigation';
import Toast from "react-native-simple-toast";


const { height, width } = Dimensions.get('screen')
// create a component
const DocManagement = () => {
    const { colors } = useTheme();
    const [licence, setlicence] = useState('')
    const [frontImg, setfrontImg] = useState([]);
    const [isModalFrontimg, setModalFrontImg] = useState(false);
    const [backImg, setBackImg] = useState([]);
    const [isModalBackimg, setModalBackImg] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);
    const [docDataList, setDocDataList] = useState([])
    console.log('docDataListdocDataListdocDataListdocDataList', docDataList);


    useEffect(() => {
        getDoclist()
    }, [])

    const getDoclist = async () => {
        try {
            const res = await HomeService.setDocList()
            // console.log('ressssssssssssssssssssssssssuser====carrrrr==================', res);
            if (res?.status === true) {
                setDocDataList(res.data)
                setlicence(res?.data?.licence_no)
            }
        } catch (error) {
            console.error('Error in getEmailLogin:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
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

    const getDriverLicence = async () => {
        const formData = new FormData()
        formData.append('licence_no', licence)
        frontImg.forEach((image, index) => {
            formData.append('licence_front_image', {
                uri: image.uri,
                name: image.fileName || `photo_${index}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });
        backImg.forEach((image, index) => {
            formData.append('licence_back_image', {
                uri: image.uri,
                name: image.fileName || `photo_${index}.jpg`,
                type: image.type || 'image/jpeg',
            });
        });

        console.log('FormDatatosend:=======================00000000000==licenceeeeeeeeeeee===', JSON.stringify(formData));

        try {
            setButtonLoader(true);
            const res = await HomeService.setUpdatelicence(formData)
            console.log('Registrationres========================', res)
            if (res?.status === true) {
                // setModalVisible(true)
                NavigationService.navigate('Home')
                Toast.show(res?.message)
            } else {
                Toast.show(res?.message)
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
            <Header title='Document Management' />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    ...styles.passwoard_view,
                    borderColor: colors.borderColor,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.secondaryThemeColor
                }}>
                    <TextInput
                        placeholder='LICENCE NUMBER'
                        placeholderTextColor={colors.borderColor}
                        style={{
                            ...styles.Password_input_sty,
                            color: colors.primaryFontColor
                        }}
                        keyboardType='visible-password'
                        value={licence}
                        onChangeText={(val) => setlicence(val)}
                        autoCapitalize="characters"
                    />
                    <Image source={require('../../assets/images/id.png')} style={styles.id_img} />

                </View>

                <TouchableOpacity
                    onPress={() => setModalFrontImg(true)}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>License Front</Text>
                </TouchableOpacity>

                <View style={{ ...styles.img_view }}>
                    {/* <Image
                        source={
                            frontImg?.length > 0
                                ? { uri: frontImg[0].uri }
                                : require('../../assets/images/blankimg.png')
                        }
                        style={styles.blank_img}
                    /> */}

                    <Image
                        source={
                            frontImg?.length > 0
                            ? { uri: frontImg[0].uri }
                                : docDataList?.licence_front_image_path
                                    ? { uri: docDataList?.licence_front_image_path }
                                    : require('../../assets/images/blankimg.png')
                        }
                        style={styles.blank_img}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => setModalBackImg(true)}
                    style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                    <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>License Back</Text>
                </TouchableOpacity>

                <View style={{ ...styles.img_view }}>
                  
                     <Image
                        source={
                            backImg?.length > 0
                            ? { uri: backImg[0].uri }
                                : docDataList?.licence_back_image_path
                                    ? { uri: docDataList?.licence_back_image_path }
                                    : require('../../assets/images/blankimg.png')
                        }
                        style={styles.blank_img}
                    />

                </View>

                <TouchableOpacity
                    onPress={() => getDriverLicence()}
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
    passwoard_view: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        borderWidth: 1,
        borderRadius: moderateScale(7),
        marginTop: moderateScale(15),
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
    id_img: {
        height: moderateScale(20),
        width: moderateScale(20)
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
});

//make this component available to the app
export default DocManagement;
