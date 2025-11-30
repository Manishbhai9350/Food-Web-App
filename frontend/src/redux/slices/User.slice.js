import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullname: "",
  email: "",
  loggedIn: false
};

const AuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    register(state,action) {
      state.fullname = action.payload.fullname
      state.email = action.payload.email
      state.loggedIn = true
    },
    login(state,action) {
      state.fullname = action.payload.fullname
      state.email = action.payload.email
      state.loggedIn = true
    },
    logout(state) {
      state.fullname = ''
      state.email = ''
      state.loggedIn = false
    },
  },
});

export const { login,logout,register } = AuthSlice.actions
export const AuthReducer = AuthSlice.reducer
export { AuthSlice }
