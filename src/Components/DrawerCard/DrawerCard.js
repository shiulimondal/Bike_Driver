//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { Image } from 'react-native';
import { useTheme } from '../../../ThemeContext';
import Icon from '../../Ui/Icon';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';
import BackHeader from '../Header/BackHeader';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../Services/Auth';
import { logout } from '../../Redux/reducer/User';
import HomeService from '../../Services/HomeServises';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
const DrawerCard = ({closeDrawer}) => {
    const { colors } = useTheme();
    const [isModalVisible, setModalVisible] = useState(false);
    const { userData } = useSelector(state => state.User)
    const dispatch = useDispatch();
    const [MyProfile, setMyProfile] = useState([])

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const drawerScreens = [
        {
            img: require('../../assets/images/house.png'),
            title: 'Home',
            handleClick: () => {NavigationService.navigate('Home'),closeDrawer()},
        },
        {
            img: require('../../assets/images/user.png'),
            title: 'Profile Management',
            handleClick: () => {NavigationService.navigate('Profile'),closeDrawer()}
        },
        {
            img: require('../../assets/images/document.png'),
            title: 'Document management',
            handleClick: () => {NavigationService.navigate('DocManagement'),closeDrawer()},
        },
        {
            img: require('../../assets/images/carm.png'),
            title: 'Car management',
            handleClick: () => {NavigationService.navigate('CarManagment'),closeDrawer()},
        },
        {
            img: require('../../assets/images/sale.png'),
            title: 'Today Sale',
            handleClick: () => {NavigationService.navigate('Sale'),closeDrawer()},
        },
        {
            img: require('../../assets/images/user.png'),
            title: 'Booking History',
            handleClick: () => {NavigationService.navigate('History'),closeDrawer()},
        },
        {
            img: require('../../assets/images/historydoc.png'),
            title: 'Payment history',
            handleClick: () => {NavigationService.navigate('PaymentHistory'),closeDrawer()},
        },
        {
            img: require('../../assets/images/key.png'),
            title: 'Change password',
            handleClick: () => {NavigationService.navigate('ChangePassword'),closeDrawer()},
        },
        {
            img: require('../../assets/images/delete.png'),
            title: 'Delete',
            handleClick: () => {setModalVisible(true),closeDrawer()},
        },
        // {
        //     img: require('../../assets/images/delete.png'),
        //     title: 'Navigation Screen',
        //     handleClick: () => {NavigationService.navigate('NavigatinScreen'),closeDrawer},
        // },
        {
            img: require('../../assets/images/Logout.png'),
            title: 'Logout',
            handleClick: () => logoutUser(),
        },
    ];

    const logoutUser = () => {
        // Toast.show('Logged Out Successfully ', Toast.SHORT);
        // AuthService.setToken(null)
        AuthService.setAccount(null);
        NavigationService.navigate('Login')
        dispatch(logout());

    };

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            const res = await HomeService.setUserProfile()
            console.log('ressssssssssssssssssssssssssuser-----------------------------------', res);
            if (res?.status === true) {
                setMyProfile(res?.data)
            }
        } catch (error) {
            console.log('Error in profileeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee:', error);
            //   Toast.show('An unexpected error occurred. Please try again later.');
        }
    }; 


    const [isLoading, setIsLoading] = useState(false);

    const getDeleteProfile = () => {
        setIsLoading(true)
        HomeService.setDeleteUser()
            .then((res) => {
                console.log('Response:=====================================', res)
                if (res && res.status === true) {
                    setModalVisible(false);
                    AsyncStorage.setItem('token', null);
                    AuthService.setAccount(null);
                    NavigationService.navigate('Login')
                    dispatch(logout())
                }
            })
            .catch((err) => {
                console.log('Error:===================serrrrr', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    
    return (
        <View style={styles.container}>
           <View style={styles.Backcontainer}>
                <TouchableOpacity onPress={closeDrawer}>
                    <Icon name={'chevron-thin-left'} type={'Entypo'} size={20} color={colors.primaryFontColor} />
                </TouchableOpacity>

                <Text style={{ ...styles.battle_txt, color: colors.primaryFontColor }}>Back</Text>
            </View>

            <View style={{ ...styles.imgcircle, backgroundColor: colors.primaryThemeColor }}>
                <Image 
                source={{uri:MyProfile?.image_path}}
                // source={require('../../assets/images/uuuu.png')} 
                style={styles.user_img} />
            </View>

            <Text style={{ ...styles.user_name_txt, color: colors.tintText }}>{MyProfile?.name}</Text>
            <Text style={{ ...styles.user_email, color: colors.tintText }}>{MyProfile?.email}</Text>



            {
                drawerScreens.map((item, index) => {
                    return (
                        <Pressable onPress={item.handleClick} key={index} style={styles.screen_view}>
                            <Image source={item.img} style={styles.icon_sty} />
                            <Text style={{ ...styles.drawerScreen, color: colors.tintText }}>{item.title}</Text>
                        </Pressable>
                    )
                })
            }

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
                    <Image source={require('../../assets/images/sdelete.png')} style={styles.del_img} />
                    <Text style={{ ...styles.conf_txt, color: colors.primaryFontColor }}>Are you sure , Do you want to delete your account</Text>

                    <View style={styles.button_view}>
                        <TouchableOpacity
                         onPress={() => getDeleteProfile()}
                            style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                                 {isLoading ? (
                                <ActivityIndicator size="small" color={colors.secondaryThemeColor} />
                            ) : (
                                <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>Yes</Text>
                            )}
                            
                        </TouchableOpacity>
                        <TouchableOpacity
                         onPress={()=>setModalVisible(false)}
                            style={{ ...styles.button_sty, backgroundColor: colors.buttonColor }}>
                            <Text style={{ ...styles.signin_txt, color: colors.secondaryThemeColor }}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        width: moderateScale(230),
        borderTopRightRadius: moderateScale(30),
        borderBottomEndRadius: moderateScale(30),
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(10)
    },
    Backcontainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: moderateScale(5),
        paddingTop: moderateScale(10),
        paddingBottom: moderateScale(20),
    },
    battle_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(5),
    },
    imgcircle: {
        height: moderateScale(52),
        width: moderateScale(52),
        borderRadius: moderateScale(40),
        alignContent: 'center',
        justifyContent: 'center',
        elevation: moderateScale(4),
        marginHorizontal:moderateScale(10)
    },
    user_img: {
        height: moderateScale(50),
        width: moderateScale(50),
        borderRadius: moderateScale(25),
        resizeMode: 'cover'
    },
    user_name_txt: {
        fontFamily: FONTS.Poppins.semibold,
        fontSize: moderateScale(14),
        marginTop: moderateScale(10),
        paddingHorizontal: moderateScale(10)
    },
    user_email: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(2),
        paddingHorizontal: moderateScale(10)
    },
    bottom_img: {
        height: moderateScale(250),
        width: moderateScale(230)
    },
    bottom_img_view: {
        position: 'absolute',
        bottom: moderateScale(-15),
        right: moderateScale(0)
    },
    screen_view: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(10),
        marginTop: moderateScale(15),
        alignItems: 'center',
        // borderBottomWidth:1,
        // borderColor:'#A0A0A0',
        paddingBottom: moderateScale(2)
    },
    icon_sty: {
        height: moderateScale(19),
        width: moderateScale(19)
    },
    drawerScreen: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginLeft: moderateScale(10)
    },
    modalView: {
        height: '45%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: moderateScale(10),
        padding:moderateScale(15)
    },
    del_img: {
        height: moderateScale(120),
        width: moderateScale(120),
        marginTop: moderateScale(20),
        alignSelf:'center'
    },
    conf_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(15),
        textAlign:'center'
    },
    button_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: moderateScale(20),
        marginTop: moderateScale(50),
    },
    button_sty: {
        width: moderateScale(140),
        height: moderateScale(45),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: moderateScale(7),
    },
    signin_txt: {
        textAlign: 'center',
        fontSize: moderateScale(13),
        fontFamily: FONTS.Poppins.semibold
    },
});

//make this component available to the app
export default DrawerCard;

