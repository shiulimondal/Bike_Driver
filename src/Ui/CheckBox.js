import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from './Icon';


const CheckBox = ({ checked, onChange, size = 25 }) => {
    return (
        <TouchableOpacity
            style={[
                styles.checkbox,
                { width: size, height: size, borderRadius: size / 5 },
                checked ? styles.checkedBox : styles.uncheckedBox,
            ]}
            onPress={() => onChange(!checked)}
        >
            {checked && <Icon name="checkmark" type={'Ionicons'}size={size * 0.7} color="white" />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    checkedBox: {
        backgroundColor: 'rgba(246, 205, 86, 1)',
        borderColor: '#EDAE10',
    },
    uncheckedBox: {
        backgroundColor: '#A0A0A0',
    },
});

export default CheckBox;
