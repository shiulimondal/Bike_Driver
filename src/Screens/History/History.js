//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from '../../Components/Header/Header';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import CompletedCard from '../../Components/HistoryCard/CompletedCard';
import CancelledCard from '../../Components/HistoryCard/CancelledCard';
import Icon from '../../Ui/Icon';
import HomeService from '../../Services/HomeServises';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen')
// create a component
const History = () => {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Completed');
    const [loader, setLoader] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [CompleteData, setCompleteData] = useState([]);
    const [CancelData, setCancelData] = useState([]);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleTo, setDatePickerVisibilityTo] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const showDatePickerTo = () => setDatePickerVisibilityTo(true);
    const hideDatePickerTo = () => setDatePickerVisibilityTo(false);

    const DatehandleConfirm = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        console.log('Selected From Date:', formattedDate);
        setFromDate(formattedDate);
        hideDatePicker();
    };

    const DatehandleConfirmTo = (date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        console.log('Selected To Date:', formattedDate);
        setToDate(formattedDate);
        hideDatePickerTo();
    };

    const GetBookkingDetails = async () => {
        if (!fromDate || !toDate) {
            console.warn('Both From and To dates must be selected');
            return;
        }
        setLoader(true);
        let data = { from_date: fromDate, to_date: toDate };
        try {
            const res = await HomeService.setHistorydata(data);
            if (res?.status) {
                setHistoryData(res);
                setCompleteData(res.completed_bookings || []);
                setCancelData(res.cancelled_bookings || []);
            } else {
                setCompleteData([]);
                setCancelData([]);
            }
        } catch (error) {
            console.error('Error fetching history data:', error);
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="History" />

            {/* Tab Navigation */}
            <View style={{ ...styles.main_view, backgroundColor: colors.inputBox, borderColor: colors.buttonColor }}>
                <Pressable
                    style={{
                        ...styles.sub_main,
                        backgroundColor: activeTab === 'Completed' ? colors.buttonColor : colors.inputBox,
                    }}
                    onPress={() => setActiveTab('Completed')}
                >
                    <Text style={{ ...styles.complete_txt, color: activeTab === 'Completed' ? colors.secondaryThemeColor : '#999' }}>
                        Completed
                    </Text>
                </Pressable>
                <Pressable
                    style={{
                        ...styles.sub_main,
                        backgroundColor: activeTab === 'Cancelled' ? colors.buttonColor : colors.inputBox,
                    }}
                    onPress={() => setActiveTab('Cancelled')}
                >
                    <Text style={{ ...styles.complete_txt, color: activeTab === 'Cancelled' ? colors.secondaryThemeColor : '#999' }}>
                        Cancelled
                    </Text>
                </Pressable>
            </View>

            {/* Date Pickers */}
            <View style={styles.time_view}>
                {/* From Date Picker */}
                <View style={{ ...styles.timeAdd_view, borderColor: colors.shadowColor }}>
                    <Text style={{ ...styles.time_to_txt, color: colors.secondaryText }}>
                        {fromDate ? moment(fromDate).format('L') : 'From'}
                    </Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                    </TouchableOpacity>
                    <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={DatehandleConfirm} maximumDate={new Date()} onCancel={hideDatePicker} />
                </View>

                {/* To Date Picker */}
                <View style={{ ...styles.timeAdd_view, borderColor: colors.shadowColor }}>
                    <Text style={{ ...styles.time_to_txt, color: colors.secondaryText }}>
                        {toDate ? moment(toDate).format('L') : 'To'}
                    </Text>
                    <TouchableOpacity onPress={showDatePickerTo}>
                        <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                    </TouchableOpacity>
                    <DateTimePickerModal isVisible={isDatePickerVisibleTo} mode="date" onConfirm={DatehandleConfirmTo} maximumDate={new Date()} onCancel={hideDatePickerTo} />
                </View>

                {/* Search Icon */}
                <TouchableOpacity style={{ ...styles.timeAdd_view, width: 40, borderWidth: 0, backgroundColor: colors.subFontcolor, alignItems: 'center', justifyContent: 'center' }} onPress={GetBookkingDetails}>
                    <Icon name={'search1'} type={'AntDesign'} color={'#001A72'} size={20} />
                </TouchableOpacity>
            </View>

            {/* Loader */}
            {loader ? (
                <ActivityIndicator size="large" color={colors.buttonColor} style={{ marginTop: 20 }} />
            ) : (
                // Booking Data List
                activeTab === 'Completed' ? (
                    CompleteData.length > 0 ? (
                        <FlatList data={CompleteData} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => <CompletedCard item={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} />
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: 16, color: '#555' }}>No data found</Text>
                        </View>
                    )
                ) : (
                    CancelData.length > 0 ? (
                        <FlatList data={CancelData} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => <CancelledCard item={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }} />
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: 16, color: '#555' }}>No data found</Text>
                        </View>
                    )
                )
            )}
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    main_view: {
        width: width - moderateScale(30),
        alignSelf: 'center',
        marginTop: moderateScale(10),
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: moderateScale(8),
        marginBottom: moderateScale(10)
    },
    sub_main: {
        padding: moderateScale(10),
        alignItems: 'center',
        justifyContent: 'center',
        width: moderateScale(150),
        borderRadius: moderateScale(8),
    },
    complete_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    },
    time_view: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(15),
        justifyContent: 'space-between',
    },
    timeAdd_view: {
        height: moderateScale(35),
        width: moderateScale(125),
        borderWidth: 1,
        borderRadius: moderateScale(7),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10)
    },
    time_to_txt: {
        fontFamily: FONTS.Poppins.medium,
        fontSize: moderateScale(13)
    }
});

//make this component available to the app
export default History;
