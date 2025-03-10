import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const CustomToggleSwitch = ({ value, onValueChange }) => {
  const [circlePosition] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(circlePosition, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handleToggle = () => {
    onValueChange(!value);
  };

  const circleTranslateX = circlePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22], 
  });

  return (
    <TouchableOpacity onPress={handleToggle} style={[styles.switchContainer, { backgroundColor: value ? 'green' : 'gray' }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: circleTranslateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 40,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 2,
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 13,
    backgroundColor: 'white',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export default CustomToggleSwitch;
