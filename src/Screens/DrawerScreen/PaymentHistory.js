//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Header from '../../Components/Header/Header';
import Icon from '../../Ui/Icon';
import { useTheme } from '../../../ThemeContext';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import PaymentHistoryCard from '../../Components/DrawerCard/PaymentHistoryCard';

// create a component
const PaymentHistory = () => {
    const { colors } = useTheme();
    return (
        <View style={styles.container}>
            <Header title="Payment History" />

            <View style={{ ...styles.time_view }}>
                <View style={{ ...styles.timeAdd_view,borderColor:colors.shadowColor}}>
                    <Text style={{...styles.time_to_txt,color:colors.secondaryText}}>To</Text>
                    <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                </View>
                <View style={{ ...styles.timeAdd_view,borderColor:colors.shadowColor}}>
                    <Text  style={{...styles.time_to_txt,color:colors.secondaryText}}>Form</Text>
                    <Icon name={'calendar'} type={'Feather'} color={'#001A72'}  size={20}/>
                </View>
                <View  style={{ ...styles.timeAdd_view,width:moderateScale(40),
                    borderWidth:0,backgroundColor:colors.subFontcolor
                    }}>
                <Icon name={'search1'} type={'AntDesign'} color={'#001A72'}  size={20}/>
                </View>
            </View>
            <FlatList
                    data={[...Array(8)]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <PaymentHistoryCard key={index} />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    time_view: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(15),
        justifyContent:'space-between',
    },
    timeAdd_view:{
        height:moderateScale(35),
        width:moderateScale(125),
        borderWidth:1,
        borderRadius:moderateScale(7),
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:moderateScale(10)
    },
    time_to_txt:{
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    }
});

//make this component available to the app
export default PaymentHistory;
