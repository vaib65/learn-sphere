import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../features/api/baseApi";
import {authReducer} from "../features/auth/authSlice"

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth:authReducer
});
export default rootReducer;