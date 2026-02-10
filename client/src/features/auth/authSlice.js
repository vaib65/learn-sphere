import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   isAuthenticated: false,
//   isAuthChecked: false,
// };

// const authSlice = createSlice({
//   name: "authSlice",
//   initialState,
//   reducers: {
//     userLoggedIn: (state, action) => {
//       state.user = action.payload.user;
//       state.isAuthenticated = true;
//       state.isAuthChecked = true;
//     },
//     userLoggedOut: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//       state.isAuthChecked = true;
//     },
//   },
// });

// export const { userLoggedIn, userLoggedOut } = authSlice.actions;
// export default authSlice.reducer;

const initialState = {
  user:null,
  roll: null,
  status:"loading"
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocally(state) {
      state.user = null;
      state.roll = null;
      state.status = "unauthenticated";
    }
  },
  extraReducers
})