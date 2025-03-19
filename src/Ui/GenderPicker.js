import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Dimensions } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import Icon from './Icon';

const { height, width } = Dimensions.get('screen');
const GenderPicker = ({ label, options, selectedValue, onValueChange, labelKey = "option_name", valueKey = "id", placeholder = "Select" }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOptionPress = (value) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.pickerText}>
                    {selectedValue ? options?.find(option => option[valueKey] === selectedValue)?.[labelKey] : placeholder}
                </Text>
                <Icon name="down" type='AntDesign' size={16} style={styles.icon} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            showsVerticalScrollIndicator={true}
                            data={options}
                            keyExtractor={(item) => item[valueKey].toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => handleOptionPress(item[valueKey])}
                                >
                                    <Text style={styles.optionText}>{item[labelKey]}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        // marginBottom: 16,
        marginTop:-10
    },
    label: {
        fontSize: 16,
        // marginBottom: 8,
        color:'#000'
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor:'#fff',
        height:51,
        width: width - 30
    },
    pickerText: {
        fontSize:14,
        // fontFamily: FONTS.Inter.regular,
         color:'#000'
    },
    icon: {
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        height:200
    },
    option: {
        padding: 10,
        borderBottomWidth:1,
        paddingBottom:5,
        borderColor:'#f3f3f3'
    },
    optionText: {
        fontSize: 15,
        // fontFamily: FONTS.Inter.regular,
        color:'#000'
    },
});

export default GenderPicker;
