import { authApi } from "../features/auth/authApi";
import { redirect } from "react-router-dom";
import {store} from "../app/store"
import { userLoggedIn, userLoggedOut } from "../features/auth/authSlice";

export const authLoader = async () => {
    try {
        const result = await Store.dispatch(authApi.endpoints.getMe.initiate());
        if ("data" in result && result.data?.data?.user) {
            store.dispatch(userLoggedIn(result.data.data.user));
            return null;
        }
    } catch (error) {
        store.dispatch(userLoggedOut())
        return redirect("/login")
    }
}