import HttpClient from "../Utils/HttpClient"
import MainStorage from "../Utils/MainStorage";

const getAccount = async () => {
    return MainStorage.get('account');
}

const setAccount = async (data) => {
    return MainStorage.set('account', data);
}
async function setToken(data) {
    return await MainStorage.set('token', data);
}

const setUserProfile = async () => {
    return HttpClient.post('/get-profile');
}
const setUpdateProfile = async (data) => {
    return HttpClient.post('/driver/update-profile', data);
}
const setUpdatelicence = async (data) => {
    return HttpClient.post('/driver/update-driving-licence', data);
}
const setcarlist = async () => {
    return HttpClient.post('/driver/all-car-category-list',);
}
const setcarmedellist = async (data) => {
    return HttpClient.post('/driver/all-car-category-list',data);
}
const setcarColorlist = async () => {
    return HttpClient.post('/driver/all-car-color-list');
}
const setcarDetails = async () => {
    return HttpClient.post('/driver/car/view');
}
const setAddCarData = async (data) => {
    return HttpClient.post('/driver/car-add',data);
}
const setDocList = async () => {
    return HttpClient.post('/driver/get-driving-licence',);
}
const setDriverLocation = async (data) => {
    return HttpClient.post('/driver/update-location',data);
}
const setUserData = async () => {
    return HttpClient.post('/driver/get-requested-trip');
}
const setAcceptBooking = async (data) => {
    return HttpClient.post('/driver/trip-accept',data);
}
const setAcceptBookingData = async () => {
    return HttpClient.post('/driver/get-accepted-trip');
}
const setStartTrip = async (data) => {
    return HttpClient.post('/driver/start-trip',data);
}
const setAfterTrip = async () => {
    return HttpClient.post('/driver/get-on-trip');
}
const setEndTrip = async (data) => {
    return HttpClient.post('/driver/end-trip',data);
}
const setShowsummery = async (data) => {
    return HttpClient.post('/driver/booking-summary',data);
}
const setSaleData = async () => {
    return HttpClient.post('/driver/today-sales');
}
const setHistorydata = async (data) => {
    return HttpClient.post('/driver/trip-history',data);
}
const setDeleteUser = async (data) => {
    return HttpClient.post('/delete-account',data);
}
const setChangePassword = async (data) => {
    return HttpClient.post('/change-password',data);
}

const HomeService = {
    getAccount,
    setAccount,
    setToken,
    setUserProfile,
    setUpdateProfile,
    setUpdatelicence,
    setcarlist,
    setAddCarData,
    setDocList,
    setcarmedellist,
    setcarColorlist,
    setcarDetails,
    setDriverLocation,
    setUserData,
    setAcceptBooking,
    setAcceptBookingData,
    setStartTrip,
    setAfterTrip ,
    setEndTrip,
    setShowsummery,
    setSaleData,
    setHistorydata,
    setDeleteUser,
    setChangePassword
}

export default HomeService;