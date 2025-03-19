//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, TouchableOpacity } from 'react-native';
import Header from '../../Components/Header/Header';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from '../../../ThemeContext';
import { FONTS } from '../../Constants/Fonts';
import CompletedCard from '../../Components/HistoryCard/CompletedCard';
import CancelledCard from '../../Components/HistoryCard/CancelledCard';
import Icon from '../../Ui/Icon';
import HomeService from '../../Services/HomeServises';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { height, width } = Dimensions.get('screen')
// create a component
const History = () => {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState('Completed')
    const [loader, setloader] = useState(false)
    const [historyData, setHistoryData] = useState([])
    const [CompleteData, setCompleteData] = useState([])
    const [CancelData, setCancelData] = useState([])
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


    useEffect(() => {
        GetBookkingDetails()
    }, [])

    const GetBookkingDetails = async () => {
        let data = {
            "from_date": Datee || '',
            "to_date": Date || ''
        }
        try {
            const res = await HomeService.setHistorydata(data);
            // console.log('historyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy-------------->>>>>>>>:', JSON.stringify(res));
            if (res?.status === true) {
                const completedBookings = allData.completed_bookings || [];
                const cancelledBookings = allData.cancelled_bookings || [];
    
                setHistoryData(allData);
                setCompleteData(completedBookings);
                setCancelData(cancelledBookings);
            } else {
                // console.error('Fetching booking-----------------:', res?.message || 'Unknown error');
            }
        } catch (error) {
            // console.error('Error fetching car list:------------------------------', error);
        } finally {
            setloader(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="History" />
            
            <View
                style={{
                    ...styles.main_view,
                    backgroundColor: colors.inputBox,
                    borderColor: colors.buttonColor,
                }}
            >
                <Pressable
                    style={{
                        ...styles.sub_main,
                        backgroundColor: activeTab === 'Completed' ? colors.buttonColor : colors.inputBox,
                    }}
                    onPress={() => setActiveTab('Completed')}
                >
                    <Text
                        style={{
                            ...styles.complete_txt,
                            color: activeTab === 'Completed' ? colors.secondaryThemeColor : colors.secondaryText,
                        }}
                    >
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
                    <Text
                        style={{
                            ...styles.complete_txt,
                            color: activeTab === 'Cancelled' ? colors.secondaryThemeColor : colors.secondaryText,
                        }}
                    >
                        Cancelled
                    </Text>
                </Pressable>
            </View>

            <View style={{ ...styles.time_view }}>
                <View style={{ ...styles.timeAdd_view, borderColor: colors.shadowColor }}>
                    <Text style={{ ...styles.time_to_txt, color: colors.secondaryText }}>{!DateData == '' ? moment(DateData).format('L') : 'To'}</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={val => {
                            DatehandleConfirm(val);
                            setDateData(val);
                        }}
                        onCancel={hideDatePicker}
                    />

                </View>
                <View style={{ ...styles.timeAdd_view, borderColor: colors.shadowColor }}>
                    <Text style={{ ...styles.time_to_txt, color: colors.secondaryText }}>{!DateData == '' ? moment(DateData).format('L') : 'Form'}</Text>
                    <TouchableOpacity onPress={showDatePickerr}>
                        <Icon name={'calendar'} type={'Feather'} color={'#001A72'} size={20} />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisiblee}
                        mode="date"
                        onConfirm={val => {
                            DatehandleConfirmm(val);
                            setDateDataa(val);
                        }}
                        onCancel={hideDatePickerr}
                    />

                </View>
                <View style={{
                    ...styles.timeAdd_view, width: moderateScale(40),
                    borderWidth: 0, backgroundColor: colors.subFontcolor
                }}>
                    <Icon name={'search1'} type={'AntDesign'} color={'#001A72'} size={20} />
                </View>
            </View>

            {activeTab === 'Completed' ? (
                CompleteData?.length > 0 ? (
                    <FlatList
                        data={CompleteData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <CompletedCard item={item} key={index} getReview={getReview} />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: '#555' }}>No data found</Text>
                    </View>
                )
            ) : (
                CancelData?.length > 0 ? (
                    <FlatList
                        data={CancelData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <CancelledCard item={item} key={index} />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: '#555' }}>No data found</Text>
                    </View>
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
