import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => "/users/me",
            providesTags:["User"]
        })
    })
})

export const { useGetMeQuery } = authApi;