import { createSlice } from '@reduxjs/toolkit';

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    login_status: false,
  },
  reducers: {
    setUser(state, action) {  
      state.userData = action.payload; 
      state.login_status = true;
    },
    logout(state) {
      state.userData = null;  
      state.login_status = false;
    }
  }
});

export const { setUser, logout } = UserSlice.actions;
export default UserSlice.reducer;

