import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer } from "../slices/User.slice";


export const AuthStore = configureStore({
    reducer: {
        user:AuthReducer
    }
})