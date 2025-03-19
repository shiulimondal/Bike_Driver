import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Marker } from "react-native-maps";
import { moderateScale } from "../Constants/PixelRatio";
import Icon from "./Icon";

const CustomMarker = ({ coordinate }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.5, 
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1, 
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Marker coordinate={coordinate} title="Your Location">
      <View style={{ alignItems: "center",
         justifyContent: "center",
         width: moderateScale(120),
         height: moderateScale(120),
         borderRadius: moderateScale(60),
         }}>

        <Animated.View
          style={{
            position: "absolute",
            width: moderateScale(120),
            height: moderateScale(120),
            borderRadius: moderateScale(60),
            backgroundColor: "rgba(255, 204, 0, 0.1)", 
            opacity: animatedValue.interpolate({
              inputRange: [1, 1.5],
              outputRange: [1, 0], 
            }),
            transform: [{ scale: animatedValue }],
          }}
        />

        {[0.5, 0.4, 0.3, 0.2].map((opacity, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              width: moderateScale(80 - index * 15),
              height: moderateScale(80 - index * 15),
              borderRadius: moderateScale(40 - index * 4),
              backgroundColor: `rgba(255, 204, 0, ${opacity})`,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ))}


        <Icon name={"location-dot"} type={"FontAwesome6"} size={18} color={"#000"} />
      </View>
    </Marker>
  );
};

export default CustomMarker;
