import { baseApi } from "../../services/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "/users/login",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Auth"],
    }),

    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "/users/register",
        method: "POST",
        body: inputData,
      }),
    }),

    getMe: builder.query({
      query: () => "/users/me",
      providesTags: ["Auth"],
    }),

    LogOutUser: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetMeQuery,
  useLogOutUserMutation,
} = authApi;
