import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { useTheme } from '../../../ThemeContext';
import Icon from '../../Ui/Icon';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BackHeader = ({ title = '' }) => {
    const { colors } = useTheme();
    const navigation = useNavigation();
  
    return (
        <View>
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true} 
            />
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name={'chevron-thin-left'} type={'Entypo'} size={22} color={colors.primaryFontColor} />
                </TouchableOpacity>

                <Text style={{ ...styles.battle_txt, color: colors.primaryFontColor }}>Back</Text>
            </View>
        </View>
    );
};

// Define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: moderateScale(15),
        paddingTop: moderateScale(30),
        paddingBottom: moderateScale(20),
    },
    battle_txt: {
        fontFamily: FONTS.Poppins.regular,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(10),
    },
});

export default BackHeader;
