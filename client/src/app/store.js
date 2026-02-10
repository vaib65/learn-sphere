import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer.js";
import { baseApi } from "../services/baseApi.js";

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
