//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TextInput, FlatList, YellowBox, ActivityIndicator } from 'react-native';
import Header from '../../Components/Header/Header';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import SaleCard from '../../Components/DrawerCard/SaleCard';
import HomeService from '../../Services/HomeServises';

const { height, width } = Dimensions.get('screen')
// create a component
const Sale = () => {
    const { colors } = useTheme();

    const [saledata, setSaledata] = useState([])
    const [totalsaledata, settotalSaledata] = useState([])
    const [Loader, setLoader] = useState(false);

    useEffect(() => {
        GetSaleData()
    }, [])

    const GetSaleData = async () => {
        setLoader(true);
        try {
            const res = await HomeService.setSaleData();
            console.log('fullllllllllllldataaaaaaaaaaaaaaaaaaahissss---:', res);
            if (res?.status === true) {
                setSaledata(res.data)
                settotalSaledata(res)
            } else {
                // console.error('Fetching car list failed:', res?.message || 'Unknown error');
            }
        } catch (error) {
            console.log('Error full his list:------------------------------', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title='Today Sale' />
            <TextInput
                placeholder='Today Sale'
                placeholderTextColor={colors.primaryFontColor}
                style={{
                    ...styles.input_sty,
                    borderColor: colors.inputBorder,
                    color: colors.primaryFontColor,
                    backgroundColor: colors.inputBox
                }}
                keyboardType='numbers-and-punctuation'
                editable={false}
            />
            {Loader ? (
                <ActivityIndicator size="large" color={colors.primaryFontColor} style={styles.loader} />
            ) : saledata.length === 0 ? (
                <Text style={styles.noDataText}>No sales data available.</Text>
            ) : (
                <FlatList
                    data={saledata}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => <SaleCard index={index} item={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
            
            {
                totalsaledata?.data?.length === 0 &&
                    totalsaledata?.total_distace === "" &&
                    totalsaledata?.total_fare === 0
                    ? null
                    : (
                        <View style={styles.bottm_view}>
                            <View>
                                <Text style={{ ...styles.total_txt, color: colors.primaryFontColor }}>Total Distance</Text>
                                <View style={styles.bottom_mView}>
                                    <Image source={require('../../assets/images/salemap.png')} style={styles.map_img} />
                                    <Text style={{ ...styles.distrance_txt, color: colors.primaryFontColor }}>
                                        {totalsaledata?.total_distace || "N/A"}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Text style={{ ...styles.total_txt, color: colors.primaryFontColor }}>Total Trip Fare</Text>
                                <Text style={{ ...styles.trip_txt, color: colors.tintText }}>
                                    ₹ {totalsaledata?.total_fare ?? "0.00"}
                                </Text>
                            </View>
                        </View>
                    )
            }



        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    input_sty: {
        borderWidth: 1,
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(15),
        height: moderateScale(48),
        borderRadius: moderateScale(7),
        paddingHorizontal: moderateScale(10),
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    noDataText: {
        textAlign: 'center',
        marginTop: moderateScale(20),
        fontSize: moderateScale(14),
        fontFamily: FONTS.Poppins.medium,
        color: 'gray',
    },
    bottm_view: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: moderateScale(15)
    },
    bottom_mView: {
        flexDirection: 'row',
    },
    total_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(14)
    },
    map_img: {
        height: moderateScale(18),
        width: moderateScale(18)
    },
    distrance_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(12),
        marginLeft: moderateScale(7)
    },
    trip_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(12)
    },
});

//make this component available to the app
export default Sale;
