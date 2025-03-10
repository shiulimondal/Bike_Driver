//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import BackHeader from '../../Components/Header/BackHeader';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import Modal from 'react-native-modal';
import NavigationService from '../../Services/Navigation';

// create a component
const { height, width } = Dimensions.get('screen')
const Profile = () => {
    const { colors } = useTheme();
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <View style={styles.container}>
            <BackHeader />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    alignItems: 'center'
                }}>
                    <View style={{ ...styles.user_img_view, backgroundColor: colors.secondaryFontColor }}>

                    </View>
                    <View style={{ ...styles.camera_circle, backgroundColor: colors.primaryThemeColor }}>
                        <Image
                            source={require('../../assets/images/camera.png')}
                            style={styles.camera_img}
                        /> 
                    </View>

                    {/* <Image
                source={require('../../assets/images/Ellips.png')}
                style={styles.user_img}
            /> */}

                </View>
                <Text style={{ ...styles.upload_txt, color: colors.secondaryFontColor }}>Upload your profile picture</Text>

                <TextInput
                    placeholder='Full Name'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                />

                <TextInput
                    placeholder='Email or Phone'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                />

                <TextInput
                    placeholder='Password'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                />


                <TextInput
                    placeholder='Confirm Password'
                    placeholderTextColor={colors.borderColor}
                    style={{
                        ...styles.input_sty,
                        borderColor: colors.borderColor,
                        color: colors.primaryFontColor,
                        backgroundColor: colors.secondaryThemeColor
                    }}
                    keyboardType='numbers-and-punctuation'
                />
                <TouchableOpacity
                    onPress={()=>NavigationService.navigate('UserStack')}
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
        width: moderateScale(100)
    },
    input_sty: {
        borderWidth: 1,
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(30),
        height: moderateScale(48),
        borderRadius: moderateScale(7),
        paddingHorizontal: moderateScale(10),
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    button_sty: {
        width: width - moderateScale(30),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: moderateScale(30),
        marginHorizontal: moderateScale(15),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(150)
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
    user_img_view: {
        height: moderateScale(100),
        width: moderateScale(100),
        borderRadius: moderateScale(60),
        alignItems: 'center',
        justifyContent: 'center'
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
});

//make this component available to the app
export default Profile;
