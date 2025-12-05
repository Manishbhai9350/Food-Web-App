import { configureStore } from "@reduxjs/toolkit";
import { AuthReducer as UserAuthReducer } from "../slices/User.slice";
import { AuthReducer as PartnerAuthReducer } from "../slices/Partner.slice";


export const AuthStore = configureStore({
    reducer: {
        user:UserAuthReducer,
        partner:PartnerAuthReducer
    }
})