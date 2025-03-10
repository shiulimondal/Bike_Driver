import HttpClient from "../Utils/HttpClient"
import MainStorage from "../Utils/MainStorage";

const getAccount = async () => {
    return MainStorage.get('account');
}

const setAccount = async (data) => {
    return MainStorage.set('account', data);
}
const setEmail = async (data) => {
    return HttpClient.post('/driver/send-phone-otp', data);
}
const setEmailOtp = async (data) => {
    return HttpClient.post('/driver/phone-otp-verify', data);
}
const setRegister = async (data) => {
    return HttpClient.post('/driver/register', data);
}
const setLogin = async (data) => {
    return HttpClient.post('/login', data);
}

const setForgetPassword = async (data) => {
    return HttpClient.post('/forgot-password', data);
}
const setForgetPasswordOtp = async (data) => {
    return HttpClient.post('/forgot-password-check-otp', data);
}
const setResetPassword = async (data) => {
    return HttpClient.post('/reset-password', data);
}
  
const AuthService = {
    getAccount,
    setAccount,
    setEmail,
    setEmailOtp,
    setRegister,
    setLogin,
    setForgetPassword,
    setForgetPasswordOtp,
    setResetPassword
}

export default AuthService;