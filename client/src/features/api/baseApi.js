import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseApi =createApi ({
    reducerPath: "baseApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:5000/api/v1",
        credentials:"include"
    }),

    tagTypes: [
    "Auth",
    "User",
    "Course",
    "Enrollment",
    "Lecture",
  ],

  endpoints: () => ({}),
})