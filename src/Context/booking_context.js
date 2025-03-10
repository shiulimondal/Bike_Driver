import React, { useEffect, useReducer, useState } from "react";
import { getDistance, getPreciseDistance } from 'geolib';
import axios from "axios";

export const BookingContext = React.createContext({})

const initialState = {
    userfromlocation: null,
    uerTolocation: null,
    vialocationArray: [],
    bookingDate: new Date(),
    bookingTime: new Date(),
    passengersNumber: 1,
    triptype: 0,
    vialocatationselected: {},
    supplierInfo: null,
    lagguageitems: 1,
    totalDistance: '',
    totaltime: '',
    mapviewCurrentlocation: false,
    paymentDetails: {
        cardName: '',
        cardNumber: '',
        cardCVV: '',
        cardExp: ''
    },
    price: {
        basePrice: 0.00,
        airportPickupFee: 0.00,
        perKMPrice: 0.00,
        totalPrice: 140
    },
    statusHistory: [],
    loginsucessfull: false,
    return_booking: {
        return_pickup: null,
        return_drop: null,
        return_date: new Date(),
        return_time: new Date()
    },
    return_confirm: 0,
    locationisfound: false,
    via_addres_confirmed: 0
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "UPADTE_PICK_UP_LOCATION":
            return { ...state, userfromlocation: action.payload };
        case "UPADTE_DROPOFF_LOCATION":
            return { ...state, uerTolocation: action.payload };
        case "LOGIN_SUCESFULL":
            return { ...state, loginsucessfull: true };
        case "LOGOUT_USER":
            return { ...state, loginsucessfull: false };
        case "BOOKING_TIME":
            return { ...state, bookingTime: action.payload };
        case "BOOKING_DATE":
            return { ...state, bookingDate: action.payload };
        case "PASSENGER":
            return { ...state, passengersNumber: action.payload };
        case "NUMBEROFITEMS":
            return { ...state, lagguageitems: action.payload };
        case "ADD_SUPPLIER":
            return { ...state, supplierInfo: action.payload };
        case "CALCULATE-DISTANCE":
            return { ...state, totalDistance: action.payload };
        case "CALCULATE-TIME":
            return { ...state, totaltime: action.payload };
        case "CURRENT_LOCATION":
            return { ...state, mapviewCurrentlocation: true };
        case "RETURN_DATE":
            return { ...state, return_booking: { ...state.return_booking, return_date: action.payload } };
        case "RETURN_TIME":
            return { ...state, return_booking: { ...state.return_booking, return_time: action.payload } };
        case "TRIP_TYPE":
            return { ...state, triptype: action.payload };
        case "REMOVE_VIA_LOCATION":
            return { ...state, vialocationArray: state.vialocationArray.filter((_, index) => index !== action.payload) };
        case "ADD_VIAADDRESS":
            return { ...state, vialocationArray: [...state.vialocationArray, action.payload] };
        default:
            return state;
    }
};

const Contextwraper = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [, setState] = useState(initialState);

    const updateState = (key, value) => {
        setState((prevState) => ({ ...prevState, [key]: value }));
    };

    const update_pickuplocation = (data) => dispatch({ type: 'UPADTE_PICK_UP_LOCATION', payload: data });
    const update_dropofflocation = (data) => dispatch({ type: 'UPADTE_DROPOFF_LOCATION', payload: data });
    const bookingtime = (data) => dispatch({ type: 'BOOKING_TIME', payload: data });
    const bookingdate = (data) => dispatch({ type: 'BOOKING_DATE', payload: data });
    const returndate = (data) => dispatch({ type: 'RETURN_DATE', payload: data });
    const returntime = (data) => dispatch({ type: 'RETURN_TIME', payload: data });
    const numberofpassenger = (data) => dispatch({ type: 'PASSENGER', payload: data });
    const numberofiterms = (data) => dispatch({ type: 'NUMBEROFITEMS', payload: data });
    const addsupplier = (data) => dispatch({ type: 'ADD_SUPPLIER', payload: data });
    const calculatedistance = (data) => dispatch({ type: 'CALCULATE-DISTANCE', payload: data });
    const setcalculatetime = (data) => dispatch({ type: 'CALCULATE-TIME', payload: data });
    const mapviewcurrentlocationupdate = (data) => dispatch({ type: 'CURRENT_LOCATION', payload: data });
    const upadtetrip_type = (data) => dispatch({ type: 'TRIP_TYPE', payload: data });
    const addviaaddress = (data) => dispatch({ type: 'ADD_VIAADDRESS', payload: data });
    const loginsucessfull = () => dispatch({ type: 'LOGIN_SUCESFULL' });
    const logoutuser = () => dispatch({ type: 'LOGOUT_USER' });
    const removeVialoaction = (indexs) => dispatch({ type: 'REMOVE_VIA_LOCATION', payload: indexs });

    useEffect(() => {
        if (!state.userfromlocation || !state.uerTolocation) return;

        const wayposints = state.vialocationArray.map(item => item.address).join(',');
        const origins = state.userfromlocation.address;
        const destinations = state.uerTolocation.address;

        const getDistanceAndTime = async () => {
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origins}&destination=${destinations}&waypoints=${wayposints}&key=AIzaSyBnMwjih2zOb96_IP8xxL9WZw2WCoRkui8`;
            try {
                const response = await axios.get(url);
                const data = response.data;
                if (data.status === 'OK') {
                    const route = data.routes[0];
                    const leg = route.legs.reduce((acc, leg) => {
                        acc.distance += leg.distance.value;
                        acc.duration += leg.duration.value;
                        return acc;
                    }, { distance: 0, duration: 0 });

                    let _TOTALDISTANCDE = leg.distance / 1609.34;
                    const hours = Math.floor(leg.duration / 3600);
                    const minutes = Math.floor((leg.duration % 3600) / 60);
                    let totalMinutes = hours * 60 + minutes;
                    let days = Math.floor(totalMinutes / 1440);
                    let remainingHours = Math.floor((totalMinutes % 1440) / 60);
                    let remainingMinutes = totalMinutes % 60;

                    let result = [];
                    if (days > 0) result.push(`${days} days`);
                    if (remainingHours > 0) result.push(`${remainingHours} hours`);
                    if (remainingMinutes > 0) result.push(`${remainingMinutes} minutes`);

                    calculatedistance(Math.floor(_TOTALDISTANCDE));
                    setcalculatetime(result);
                }
            } catch (error) {
                console.error('Error fetching distance and time:', error);
            }
        };
        getDistanceAndTime();
    }, [state.userfromlocation, state.uerTolocation, state.vialocationArray]);

    return (
        <BookingContext.Provider value={{
            state,
            dispatch,
            update_pickuplocation,
            update_dropofflocation,
            bookingtime, bookingdate,
            returndate, returntime,
            numberofpassenger,
            numberofiterms,
            addsupplier,
            calculatedistance,
            setcalculatetime,
            mapviewcurrentlocationupdate,
            upadtetrip_type,
            addviaaddress,
            loginsucessfull,
            logoutuser,
            removeVialoaction
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export default Contextwraper;